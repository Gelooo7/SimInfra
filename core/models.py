from django.db import models
from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from .crypto import encrypt_val, decrypt_val

ESTADOS = [
    ('ACTIVO', 'Activo'),
    ('LICENCIA', 'En Licencia'),
    ('BAJA', 'Dado de Baja'),
]

ESTADOS_EQUIPO = [
    ('ASIGNADO', 'Asignado'),
    ('STOCK', 'Stock / Disponible'),
    ('MANTENCION', 'En Mantención'),
    ('BAJA', 'Dado de Baja'),
]

TIPOS_EQUIPO = [
    # EQUIPOS PRINCIPALES
    ('Notebook', 'Notebook'),
    ('Celular', 'Celular'),
    ('Tablet', 'Tablet'),
    ('BAM / Router', 'BAM / Router'),
    ('Mac', 'Mac'),

    # PERIFÉRICOS
    ('Monitor', 'Monitor'),
    ('Adaptador', 'Adaptador'),
    ('Audífonos', 'Audífonos'),
    ('Teclado', 'Teclado'),
    ('Mouse', 'Mouse'),
    ('Docking', 'Docking'),
    ('Otro Periférico', 'Otro Periférico'),
]

ESTADOS_IP = [
    ('LIBRE', 'Libre'),
    ('RESERVADA', 'Reservada'),
    ('ASIGNADA', 'Asignada'),
]

ESTADOS_ANEXO = [
    ('DISPONIBLE', 'Disponible'),
    ('ASIGNADO', 'Asignado'),
]

class Usuario(models.Model):
    nombre_completo = models.CharField(max_length=150)
    usuario_red = models.CharField(max_length=50, unique=True)
    correo_corp = models.EmailField(unique=True)
    dpto_area = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100, null=True, blank=True)
    ip_asignada = models.GenericIPAddressField(null=True, blank=True)
    hostname = models.CharField(max_length=50, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ACTIVO', null=True, blank=True)
    
    gmail = models.EmailField(null=True, blank=True)
    password_gmail = models.CharField(max_length=255, null=True, blank=True)
    celular = models.CharField(max_length=30, null=True, blank=True)
    telefono = models.CharField(max_length=30, null=True, blank=True)
    anexo = models.CharField(max_length=10, null=True, blank=True)
    sif = models.BooleanField(default=False)
    vpn_cisco = models.BooleanField(default=False)
    password_vpn = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.password_gmail and not self.password_gmail.startswith('ENC::'):
            self.password_gmail = encrypt_val(self.password_gmail)

        if self.password_vpn and not self.password_vpn.startswith('ENC::'):
            self.password_vpn = encrypt_val(self.password_vpn)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre_completo} ({self.usuario_red})"

class Anexo(models.Model):
    numero_anexo = models.CharField(
        max_length=10,
        unique=True
    )

    exterior = models.CharField(
        max_length=30,
        null=True,
        blank=True
    )

    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='anexo_asignado'
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS_ANEXO,
        default='DISPONIBLE'
    )

    observaciones = models.TextField(
        null=True,
        blank=True
    )

    fecha_actualizacion = models.DateTimeField(
        auto_now=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):
        self.estado = (
            'ASIGNADO'
            if self.usuario_id
            else 'DISPONIBLE'
        )

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['numero_anexo']

    def __str__(self):
        return f"{self.numero_anexo} - {self.estado}"


class HistorialAnexo(models.Model):
    anexo = models.ForeignKey(
        Anexo,
        on_delete=models.CASCADE,
        related_name='historial'
    )

    usuario_anterior = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    usuario_nuevo = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    fecha_movimiento = models.DateTimeField(
        auto_now_add=True
    )

    accion = models.CharField(
        max_length=50,
        default='MODIFICACION'
    )

    observacion = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-fecha_movimiento']

    def __str__(self):
        return f"{self.anexo.numero_anexo} - {self.accion}"

class IP(models.Model):
    direccion_ip = models.GenericIPAddressField(unique=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_IP, default='LIBRE')
    observacion = models.CharField(max_length=255, null=True, blank=True)
    usuario = models.OneToOneField(
    Usuario,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='ip'
)
    asignado_otro = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        verbose_name = 'IP'
        verbose_name_plural = 'IPs'
        ordering = ['direccion_ip']

    def __str__(self):
        return f"{self.direccion_ip} - {self.estado}"

# =========================================
# SERVIDORES
# =========================================

class Servidor(models.Model):
    ip = models.GenericIPAddressField(
        protocol='IPv4',
        unique=True
    )

    hostname = models.CharField(
        max_length=100,
        unique=True
    )

    descripcion = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['hostname']
        verbose_name = 'Servidor'
        verbose_name_plural = 'Servidores'

    def __str__(self):
        return f"{self.hostname} - {self.ip}"


class HistorialUsuario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial')
    fecha_movimiento = models.DateTimeField(auto_now_add=True)
    accion = models.CharField(max_length=50, default='MODIFICACION')
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha_movimiento']


class Equipamiento(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipos'
    )

    tipo = models.CharField(
        max_length=30,
        choices=TIPOS_EQUIPO,
        default='Notebook'
    )

    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    numero_serie = models.CharField(
    max_length=20,
    unique=True,
    null=True,
    blank=True
)

    hostname = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    af = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )

    accesorios = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    fecha_asignacion = models.DateField(
        null=True,
        blank=True
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS_EQUIPO,
        default='ASIGNADO'
    )

    numero_telefono = models.CharField(
        max_length=30,
        null=True,
        blank=True
    )

    imei = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    pin = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    icloud_cuenta = models.EmailField(
        null=True,
        blank=True
    )

    icloud_password = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )



    

    def save(self, *args, **kwargs):

        # =====================================
        # COHERENCIA DE ASIGNACIÓN
        # =====================================

        if not self.usuario_id:
            if self.estado == 'ASIGNADO':
                self.estado = 'STOCK'

            self.fecha_asignacion = None

        elif self.estado == 'STOCK':
            self.estado = 'ASIGNADO'


        # =====================================
        # SINCRONIZAR HOSTNAME
        # Usuario -> Notebook / Mac
        # =====================================

        if (
            self.usuario_id and
            self.tipo in ['Notebook', 'Mac']
        ):
            self.hostname = (
                self.usuario.hostname.strip()
                if self.usuario.hostname
                else None
            )


        # =====================================
        # ENCRIPTAR CONTRASEÑA ICLOUD
        # =====================================

        if (
            self.icloud_password and
            not self.icloud_password.startswith('ENC::')
        ):
            self.icloud_password = encrypt_val(
                self.icloud_password
            )

        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.tipo} - {self.marca} {self.modelo} ({self.numero_serie})"


class HistorialEquipo(models.Model):
    equipo = models.ForeignKey(
        Equipamiento,
        on_delete=models.CASCADE,
        related_name='historial'
    )
    usuario_anterior = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )
    usuario_nuevo = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )
    fecha_movimiento = models.DateTimeField(
        auto_now_add=True
    )
    accion = models.CharField(
        max_length=50,
        default='MODIFICACION'
    )
    observacion = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-fecha_movimiento']

class PerfilGenerico(models.Model):
    nombre = models.CharField(max_length=150, null=True, blank=True)
    usuario = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    correo = models.EmailField(null=True, blank=True)
    dpto_area = models.CharField(max_length=100, null=True, blank=True)
    tipo = models.CharField(max_length=20, default='On Premise')
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='ACTIVO',
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('ENC::'):
            self.password = encrypt_val(self.password)

        super().save(*args, **kwargs)


class PCGenerico(models.Model):
    usuario_local = models.CharField(
        max_length=150
    )

    password = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    hostname = models.CharField(
        max_length=100,
        unique=True
    )

    dpto_area = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    marca = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    modelo = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    numero_serie = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )

    activo_fijo = models.CharField(
        max_length=12,
        null=True,
        blank=True
    )

    teamviewer_id = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    observaciones = models.TextField(
        null=True,
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    fecha_actualizacion = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('ENC::'):
            self.password = encrypt_val(self.password)

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['hostname']

    def __str__(self):
        return f"{self.hostname} - {self.usuario_local}"


class HistorialPCGenerico(models.Model):
    pc = models.ForeignKey(
        PCGenerico,
        on_delete=models.CASCADE,
        related_name='historial'
    )

    accion = models.CharField(
        max_length=50,
        default='MODIFICACION'
    )

    observacion = models.TextField(
        null=True,
        blank=True
    )

    fecha_movimiento = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-fecha_movimiento']

    def __str__(self):
        return f"{self.pc.hostname} - {self.accion}"

# --- HISTORIAL DE PCs GENERICOS ---

@receiver(pre_save, sender=PCGenerico)
def track_historial_pc_generico(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        pc_previo = PCGenerico.objects.get(pk=instance.pk)
    except PCGenerico.DoesNotExist:
        return

    cambios = []

    def add_cambio(campo, anterior, actual):
        if str(anterior) != str(actual):
            cambios.append(
                f"{campo}:::{anterior or 'N/I'}:::{actual or 'N/I'}"
            )

    add_cambio(
        "Usuario Local",
        pc_previo.usuario_local,
        instance.usuario_local
    )

    add_cambio(
        "Hostname",
        pc_previo.hostname,
        instance.hostname
    )

    add_cambio(
        "Departamento / Área",
        pc_previo.dpto_area,
        instance.dpto_area
    )

    add_cambio(
        "Marca",
        pc_previo.marca,
        instance.marca
    )

    add_cambio(
        "Modelo",
        pc_previo.modelo,
        instance.modelo
    )

    add_cambio(
        "Número de Serie",
        pc_previo.numero_serie,
        instance.numero_serie
    )

    add_cambio(
        "Activo Fijo",
        pc_previo.activo_fijo,
        instance.activo_fijo
    )

    add_cambio(
        "ID TeamViewer",
        pc_previo.teamviewer_id,
        instance.teamviewer_id
    )
    add_cambio(
            "Observaciones",
            pc_previo.observaciones,
            instance.observaciones
        )

    # Comparar contraseña desencriptada para evitar
    # registrar falsos cambios por el cifrado
    password_anterior = (
        decrypt_val(pc_previo.password)
        if pc_previo.password
        else None
    )

    password_nueva = (
        decrypt_val(instance.password)
        if instance.password
        else None
    )

    if password_anterior != password_nueva:
        cambios.append(
            "Contraseña:::••••••••:::••••••••"
        )

    if cambios:
        HistorialPCGenerico.objects.create(
            pc=instance,
            accion="MODIFICACION",
            observacion="||".join(cambios)
        )


@receiver(post_save, sender=PCGenerico)
def registrar_creacion_pc_generico(
    sender,
    instance,
    created,
    **kwargs
):
    if not created:
        return

    HistorialPCGenerico.objects.create(
        pc=instance,
        accion="CREACION",
        observacion=(
            f"PC Genérico creado - "
            f"Hostname: {instance.hostname}"
        )
    )

# --- HISTORIAL DE ANEXOS ---

@receiver(pre_save, sender=Anexo)
def track_historial_anexo(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        anexo_previo = Anexo.objects.get(pk=instance.pk)
    except Anexo.DoesNotExist:
        return

    cambios = []

    def add_cambio(campo, anterior, actual):
        if str(anterior) != str(actual):
            cambios.append(
                f"{campo}:::{anterior or 'N/I'}:::{actual or 'N/I'}"
            )

    usuario_anterior = (
        anexo_previo.usuario.nombre_completo
        if anexo_previo.usuario
        else "Sin asignar"
    )

    usuario_nuevo = (
        instance.usuario.nombre_completo
        if instance.usuario
        else "Sin asignar"
    )

    add_cambio(
        "Número Anexo",
        anexo_previo.numero_anexo,
        instance.numero_anexo
    )

    add_cambio(
        "Exterior",
        anexo_previo.exterior,
        instance.exterior
    )

    add_cambio(
        "Usuario Asignado",
        usuario_anterior,
        usuario_nuevo
    )

    add_cambio(
        "Estado",
        anexo_previo.estado,
        instance.estado
    )

    add_cambio(
        "Observaciones",
        anexo_previo.observaciones,
        instance.observaciones
    )

    if cambios:
        HistorialAnexo.objects.create(
            anexo=instance,
            usuario_anterior=usuario_anterior,
            usuario_nuevo=usuario_nuevo,
            accion="MODIFICACION",
            observacion="||".join(cambios)
        )


@receiver(post_save, sender=Anexo)
def registrar_creacion_anexo(sender, instance, created, **kwargs):
    if not created:
        return

    usuario_nuevo = (
        instance.usuario.nombre_completo
        if instance.usuario
        else "Sin asignar"
    )

    HistorialAnexo.objects.create(
        anexo=instance,
        usuario_anterior="Sin asignar",
        usuario_nuevo=usuario_nuevo,
        accion="CREACION",
        observacion=(
            f"Anexo creado con estado {instance.estado}"
        )
    )        

# --- HISTORIAL DE EQUIPAMIENTO ---

@receiver(pre_save, sender=Equipamiento)
def track_historial_equipo(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        equipo_previo = Equipamiento.objects.get(pk=instance.pk)
    except Equipamiento.DoesNotExist:
        return

    cambios = []

    def add_cambio(campo, anterior, actual):
        if str(anterior) != str(actual):
            cambios.append(
                f"{campo}:::{anterior or 'N/I'}:::{actual or 'N/I'}"
            )

    add_cambio(
        "Tipo",
        equipo_previo.tipo,
        instance.tipo
    )

    add_cambio(
        "Marca",
        equipo_previo.marca,
        instance.marca
    )

    add_cambio(
        "Modelo",
        equipo_previo.modelo,
        instance.modelo
    )

    add_cambio(
        "Número de Serie",
        equipo_previo.numero_serie,
        instance.numero_serie
    )

    add_cambio(
        "Hostname",
        equipo_previo.hostname,
        instance.hostname
    )

    add_cambio(
        "AF",
        equipo_previo.af,
        instance.af
    )

    add_cambio(
        "Estado",
        equipo_previo.estado,
        instance.estado
    )

    add_cambio(
        "Fecha Asignación",
        equipo_previo.fecha_asignacion,
        instance.fecha_asignacion
    )

    add_cambio(
        "Número Teléfono",
        equipo_previo.numero_telefono,
        instance.numero_telefono
    )

    add_cambio(
        "IMEI",
        equipo_previo.imei,
        instance.imei
    )

    add_cambio(
        "PIN",
        equipo_previo.pin,
        instance.pin
    )

    add_cambio(
        "Cuenta iCloud",
        equipo_previo.icloud_cuenta,
        instance.icloud_cuenta
    )

    if equipo_previo.icloud_password != instance.icloud_password:
        add_cambio(
            "Contraseña iCloud",
            "••••••••",
            "••••••••"
        )

    usuario_anterior = (
        equipo_previo.usuario.nombre_completo
        if equipo_previo.usuario
        else "Sin asignar"
    )

    usuario_nuevo = (
        instance.usuario.nombre_completo
        if instance.usuario
        else "Sin asignar"
    )

    add_cambio(
        "Usuario Asignado",
        usuario_anterior,
        usuario_nuevo
    )

    if cambios:
        HistorialEquipo.objects.create(
            equipo=instance,
            usuario_anterior=usuario_anterior,
            usuario_nuevo=usuario_nuevo,
            accion="MODIFICACION",
            observacion="||".join(cambios)
        )

# --- SINCRONIZACIÓN Y RESTRICCIÓN DE DUPLICIDAD IP ---

@receiver(pre_save, sender=IP)
def sync_ip_con_usuario(sender, instance, **kwargs):

    # IP asignada directamente a un usuario
    if instance.usuario_id:

        # Una IP de usuario no puede estar reservada para "Otro"
        instance.asignado_otro = None

        # Si estaba libre, pasa automáticamente a reservada
        if instance.estado == 'LIBRE':
            instance.estado = 'RESERVADA'

        # Un usuario solo puede tener una IP.
        # Si ya tenía otra, liberarla antes de guardar la nueva.
        IP.objects.filter(
            usuario_id=instance.usuario_id
        ).exclude(
            pk=instance.pk
        ).update(
            usuario=None,
            estado='LIBRE',
            asignado_otro=None
        )

    # IP reservada para impresora, servidor, CCTV, etc.
    elif instance.asignado_otro and instance.asignado_otro.strip():

        if instance.estado == 'LIBRE':
            instance.estado = 'RESERVADA'

    # IP sin usuario ni otro dispositivo
    else:

        if instance.estado == 'RESERVADA':
            instance.estado = 'LIBRE'
        if instance.direccion_ip:
            Usuario.objects.filter(ip_asignada=instance.direccion_ip).update(ip_asignada=None)
        else:
            if instance.pk:
             ip_prev = IP.objects.filter(pk=instance.pk).first()
            if ip_prev and ip_prev.usuario:
                Usuario.objects.filter(pk=ip_prev.usuario.pk, ip_asignada=ip_prev.direccion_ip).update(ip_asignada=None)


@receiver(pre_save, sender=Usuario)
def track_historial_usuario(sender, instance, **kwargs):
    if instance.pk:
        try:
            usr_previo = Usuario.objects.get(pk=instance.pk)
        except Usuario.DoesNotExist:
            usr_previo = None

        if usr_previo:
            if usr_previo.ip_asignada != instance.ip_asignada:
                if usr_previo.ip_asignada:
                    IP.objects.filter(direccion_ip=usr_previo.ip_asignada).update(estado='LIBRE', usuario=None)
                if instance.ip_asignada:
                    IP.objects.filter(direccion_ip=instance.ip_asignada).update(estado='RESERVADA', usuario=instance, asignado_otro=None)

            cambios = []
            def add_cambio(campo, ant, act):
                if str(ant) != str(act):
                    cambios.append(f"{campo}:::{ant or 'N/I'}:::{act or 'N/I'}")

            add_cambio("Nombre Completo", usr_previo.nombre_completo, instance.nombre_completo)
            add_cambio("Estado", usr_previo.estado, instance.estado)
            add_cambio("Hostname", usr_previo.hostname, instance.hostname)
            add_cambio("Cargo", usr_previo.cargo, instance.cargo)
            add_cambio("Departamento", usr_previo.dpto_area, instance.dpto_area)
            add_cambio("Usuario Red", usr_previo.usuario_red, instance.usuario_red)
            add_cambio("Correo Corp.", usr_previo.correo_corp, instance.correo_corp)
            add_cambio("Gmail", usr_previo.gmail, instance.gmail)
            if usr_previo.password_gmail != instance.password_gmail:
                add_cambio("Contraseña Gmail", "••••••••", "••••••••")


            add_cambio(
                "SIF",
                "Sí" if usr_previo.sif else "No",
                "Sí" if instance.sif else "No"
            )
            add_cambio(
                "VPN Cisco",
                "Sí" if usr_previo.vpn_cisco else "No",
                "Sí" if instance.vpn_cisco else "No"
            )
            if usr_previo.password_vpn != instance.password_vpn:
                add_cambio(
                    "Contraseña VPN",
                    "••••••••",
                    "••••••••"
                )

            add_cambio(
                "Teléfono",
                usr_previo.telefono,
                instance.telefono
            )

            add_cambio(
                "Celular",
                usr_previo.celular,
                instance.celular
            )

            add_cambio(
                "Anexo",
                usr_previo.anexo,
                instance.anexo
            )

            add_cambio(
                "IP Asignada",
                usr_previo.ip_asignada,
                instance.ip_asignada
            )

            if cambios:
                HistorialUsuario.objects.create(
                    usuario=instance,
                    accion="MODIFICACION",
                    observacion="||".join(cambios)
                )

@receiver(post_save, sender=Usuario)
def auto_sync_usuario(sender, instance, created, **kwargs):

    # =====================================
    # USUARIO DADO DE BAJA
    # =====================================
    if instance.estado == 'BAJA':

        # Liberar todos sus equipos
        Equipamiento.objects.filter(
            usuario=instance
        ).update(
            usuario=None,
            estado='STOCK',
            fecha_asignacion=None
        )

        # Liberar su IP
        IP.objects.filter(
            usuario=instance
        ).update(
            usuario=None,
            estado='LIBRE',
            asignado_otro=None
        )

        # Liberar su anexo
        anexo = Anexo.objects.filter(
            usuario=instance
        ).first()

        if anexo:
            anexo.usuario = None
            anexo.save()

        return

    # =====================================
    # SINCRONIZAR HOSTNAME
    # Usuario -> Notebook / Mac asignado
    # =====================================
    nuevo_hostname = (
        instance.hostname.strip()
        if instance.hostname
        else None
    )

    equipos_con_hostname = Equipamiento.objects.filter(
        usuario=instance,
        tipo__in=[
            'Notebook',
            'Mac'
        ]
    )

    for equipo in equipos_con_hostname:

        hostname_actual = (
            equipo.hostname.strip()
            if equipo.hostname
            else None
        )

        if hostname_actual != nuevo_hostname:
            equipo.hostname = nuevo_hostname

            equipo.save(
                update_fields=[
                    'hostname'
                ]
            )

    # =====================================
    # VINCULAR EQUIPO DISPONIBLE
    # POR HOSTNAME
    # =====================================
    if nuevo_hostname:
        Equipamiento.objects.filter(
            usuario__isnull=True,
            tipo__in=[
                'Notebook',
                'Mac'
            ],
            hostname__iexact=nuevo_hostname
        ).update(
            usuario=instance,
            estado='ASIGNADO'
        )


# =========================================
# ELIMINACIÓN COMPLETA DE USUARIO
# =========================================

@receiver(pre_delete, sender=Usuario)
def liberar_recursos_al_eliminar_usuario(
    sender,
    instance,
    **kwargs
):

    # Liberar equipos
    Equipamiento.objects.filter(
        usuario=instance
    ).update(
        usuario=None,
        estado='STOCK',
        fecha_asignacion=None
    )

    # Liberar IP
    IP.objects.filter(
        usuario=instance
    ).update(
        usuario=None,
        estado='LIBRE',
        asignado_otro=None
    )

    # Liberar anexo
    anexo = Anexo.objects.filter(
        usuario=instance
    ).first()

    if anexo:
        anexo.usuario = None
        anexo.save()