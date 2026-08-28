from django.db import models
from django.db.models.signals import post_save, pre_save
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
    ('Notebook', 'Notebook'),
    ('Celular', 'Celular'),
    ('Tablet', 'Tablet'),
    ('BAM / Router', 'BAM / Router'),
    ('Mac', 'Mac'),
]

ESTADOS_IP = [
    ('LIBRE', 'Libre'),
    ('RESERVADA', 'Reservada'),
    ('DUPLICADA', 'Duplicada'),
    ('DESCONOCIDA', 'Desconocida'),
    ('ASIGNADA', 'Asignada'),
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
    password_simi = models.CharField(max_length=255, null=True, blank=True)
    celular = models.CharField(max_length=30, null=True, blank=True)
    telefono = models.CharField(max_length=30, null=True, blank=True)
    anexo = models.CharField(max_length=10, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.password_gmail and not self.password_gmail.startswith('ENC::'):
            self.password_gmail = encrypt_val(self.password_gmail)
        if self.password_simi and not self.password_simi.startswith('ENC::'):
            self.password_simi = encrypt_val(self.password_simi)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre_completo} ({self.usuario_red})"


class IP(models.Model):
    direccion_ip = models.GenericIPAddressField(unique=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_IP, default='LIBRE')
    observacion = models.CharField(max_length=255, null=True, blank=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='ips')
    asignado_otro = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        verbose_name = 'IP'
        verbose_name_plural = 'IPs'
        ordering = ['direccion_ip']

    def __str__(self):
        return f"{self.direccion_ip} - {self.estado}"


class HistorialUsuario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial')
    fecha_movimiento = models.DateTimeField(auto_now_add=True)
    accion = models.CharField(max_length=50, default='MODIFICACION')
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha_movimiento']


class Equipamiento(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipos')
    tipo = models.CharField(max_length=30, choices=TIPOS_EQUIPO, default='Notebook')
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    numero_serie = models.CharField(max_length=100, unique=True)
    hostname = models.CharField(max_length=50, null=True, blank=True)
    af = models.CharField(max_length=12, null=True, blank=True)
    fecha_asignacion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_EQUIPO, default='ASIGNADO')
    
    numero_telefono = models.CharField(max_length=30, null=True, blank=True)
    imei = models.CharField(max_length=50, null=True, blank=True)
    pin = models.CharField(max_length=20, null=True, blank=True)

    icloud_cuenta = models.EmailField(null=True, blank=True)
    icloud_password = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.icloud_password and not self.icloud_password.startswith('ENC::'):
            self.icloud_password = encrypt_val(self.icloud_password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo} - {self.marca} {self.modelo} ({self.numero_serie})"


class HistorialEquipo(models.Model):
    equipo = models.ForeignKey(Equipamiento, on_delete=models.CASCADE, related_name='historial')
    usuario_anterior = models.CharField(max_length=150, null=True, blank=True)
    usuario_nuevo = models.CharField(max_length=150, null=True, blank=True)
    fecha_movimiento = models.DateTimeField(auto_now_add=True)
    accion = models.CharField(max_length=50, default='MODIFICACION')
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha_movimiento']


class PerfilGenerico(models.Model):
    nombre = models.CharField(max_length=150, null=True, blank=True)
    usuario = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    correo = models.EmailField(null=True, blank=True)
    dpto_area = models.CharField(max_length=100, null=True, blank=True)
    tipo = models.CharField(max_length=20, default='On Premise')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ACTIVO', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('ENC::'):
            self.password = encrypt_val(self.password)
        super().save(*args, **kwargs)


# --- SINCRONIZACIÓN Y RESTRICCIÓN DE DUPLICIDAD IP ---

@receiver(pre_save, sender=IP)
def sync_ip_con_usuario(sender, instance, **kwargs):
    if instance.usuario:
        instance.asignado_otro = None
        if instance.estado == 'LIBRE':
            instance.estado = 'RESERVADA'
        
        # Desasignar la IP previa que tenía ese usuario
        Usuario.objects.filter(ip_asignada=instance.direccion_ip).exclude(pk=instance.usuario.pk).update(ip_asignada=None)
        
        # Asignar esta IP al usuario
        usr = instance.usuario
        if usr.ip_asignada != instance.direccion_ip:
            # Liberar la IP previa del usuario si tenía otra
            if usr.ip_asignada:
                IP.objects.filter(direccion_ip=usr.ip_asignada).exclude(pk=instance.pk).update(estado='LIBRE', usuario=None)
            usr.ip_asignada = instance.direccion_ip
            usr.save(update_fields=['ip_asignada'])
    elif instance.asignado_otro and instance.asignado_otro.strip():
        if instance.estado == 'LIBRE':
            instance.estado = 'RESERVADA'
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
            if usr_previo.password_simi != instance.password_simi:
                add_cambio("Contraseña Simi", "••••••••", "••••••••")
            add_cambio("Teléfono", usr_previo.telefono, instance.telefono)
            add_cambio("Celular", usr_previo.celular, instance.celular)
            add_cambio("Anexo", usr_previo.anexo, instance.anexo)
            add_cambio("IP Asignada", usr_previo.ip_asignada, instance.ip_asignada)

            if cambios:
                HistorialUsuario.objects.create(
                    usuario=instance,
                    accion="MODIFICACION",
                    observacion="||".join(cambios)
                )
    else:
        if instance.ip_asignada:
            IP.objects.filter(direccion_ip=instance.ip_asignada).update(estado='RESERVADA', usuario=instance, asignado_otro=None)


@receiver(post_save, sender=Usuario)
def auto_sync_usuario(sender, instance, created, **kwargs):
    if instance.estado == 'BAJA':
        Equipamiento.objects.filter(usuario=instance).update(usuario=None, estado='STOCK', fecha_asignacion=None)
        if instance.ip_asignada:
            IP.objects.filter(direccion_ip=instance.ip_asignada).update(estado='LIBRE', usuario=None)

    if instance.hostname:
        Equipamiento.objects.filter(hostname__iexact=instance.hostname.strip()).update(
            usuario=instance, 
            estado='ASIGNADO'
        )