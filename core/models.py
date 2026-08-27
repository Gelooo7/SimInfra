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


class HistorialUsuario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial')
    fecha_movimiento = models.DateTimeField(auto_now_add=True)
    accion = models.CharField(max_length=50, default='MODIFICACION')
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha_movimiento']


class Equipamiento(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipos')
    tipo = models.CharField(max_length=20)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    numero_serie = models.CharField(max_length=100, unique=True)
    hostname = models.CharField(max_length=50, null=True, blank=True)
    af = models.CharField(max_length=12, null=True, blank=True)
    fecha_asignacion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_EQUIPO, default='ASIGNADO')
    numero_telefono = models.CharField(max_length=30, null=True, blank=True)

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
    tipo = models.CharField(max_length=20, default='ONPREMISE')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ACTIVO', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('ENC::'):
            self.password = encrypt_val(self.password)
        super().save(*args, **kwargs)


# --- AUDITORÍA COMPLETA Y MULTICAMPO DE USUARIOS ---

@receiver(pre_save, sender=Usuario)
def track_historial_usuario(sender, instance, **kwargs):
    if instance.pk:
        try:
            usr_previo = Usuario.objects.get(pk=instance.pk)
        except Usuario.DoesNotExist:
            usr_previo = None

        if usr_previo:
            cambios = []
            
            if usr_previo.nombre_completo != instance.nombre_completo:
                cambios.append(f"Nombre: '{usr_previo.nombre_completo}' ➔ '{instance.nombre_completo}'")
            if usr_previo.estado != instance.estado:
                cambios.append(f"Estado: '{usr_previo.estado}' ➔ '{instance.estado}'")
            if usr_previo.hostname != instance.hostname:
                cambios.append(f"Hostname: '{usr_previo.hostname or 'N/I'}' ➔ '{instance.hostname or 'N/I'}'")
            if usr_previo.cargo != instance.cargo:
                cambios.append(f"Cargo: '{usr_previo.cargo or 'N/I'}' ➔ '{instance.cargo or 'N/I'}'")
            if usr_previo.dpto_area != instance.dpto_area:
                cambios.append(f"Área: '{usr_previo.dpto_area}' ➔ '{instance.dpto_area}'")
            if usr_previo.usuario_red != instance.usuario_red:
                cambios.append(f"Usuario Red: '{usr_previo.usuario_red}' ➔ '{instance.usuario_red}'")
            if usr_previo.correo_corp != instance.correo_corp:
                cambios.append(f"Correo Corp: '{usr_previo.correo_corp}' ➔ '{instance.correo_corp}'")
            if usr_previo.gmail != instance.gmail:
                cambios.append(f"Gmail: '{usr_previo.gmail or 'N/I'}' ➔ '{instance.gmail or 'N/I'}'")
            if usr_previo.password_gmail != instance.password_gmail:
                cambios.append("Contraseña Gmail modificada")
            if usr_previo.password_simi != instance.password_simi:
                cambios.append("Contraseña Simi modificada")
            if usr_previo.telefono != instance.telefono:
                cambios.append(f"Teléfono: '{usr_previo.telefono or 'N/I'}' ➔ '{instance.telefono or 'N/I'}'")
            if usr_previo.anexo != instance.anexo:
                cambios.append(f"Anexo: '{usr_previo.anexo or 'N/I'}' ➔ '{instance.anexo or 'N/I'}'")
            if usr_previo.ip_asignada != instance.ip_asignada:
                cambios.append(f"IP: '{usr_previo.ip_asignada or 'Sin IP'}' ➔ '{instance.ip_asignada or 'Sin IP'}'")

            if cambios:
                HistorialUsuario.objects.create(
                    usuario=instance,
                    accion="MODIFICACION",
                    observacion="; ".join(cambios)
                )


# --- AUDITORÍA COMPLETA Y MULTICAMPO DE EQUIPOS ---

@receiver(pre_save, sender=Equipamiento)
def auto_completar_por_hostname_y_track_historial(sender, instance, **kwargs):
    if instance.hostname:
        user_match = Usuario.objects.filter(hostname__iexact=instance.hostname.strip()).first()
        if user_match:
            instance.usuario = user_match
            if not instance.fecha_asignacion:
                instance.fecha_asignacion = timezone.now().date()

    if instance.usuario and not instance.fecha_asignacion:
        instance.fecha_asignacion = timezone.now().date()
    elif not instance.usuario:
        instance.fecha_asignacion = None

    if not instance.usuario and instance.estado == 'ASIGNADO':
        instance.estado = 'STOCK'
    elif instance.usuario and instance.estado == 'STOCK':
        instance.estado = 'ASIGNADO'

    if instance.pk:
        try:
            equipo_previo = Equipamiento.objects.get(pk=instance.pk)
        except Equipamiento.DoesNotExist:
            equipo_previo = None

        if equipo_previo:
            cambios = []
            accion = "MODIFICACION"

            if equipo_previo.usuario != instance.usuario:
                prev_user = equipo_previo.usuario.nombre_completo if equipo_previo.usuario else 'Sin Asignar (Stock)'
                new_user = instance.usuario.nombre_completo if instance.usuario else 'Sin Asignar (Stock)'
                accion = "DESASIGNACION" if not instance.usuario else "ASIGNACION"
                cambios.append(f"Usuario: '{prev_user}' ➔ '{new_user}'")

            if equipo_previo.estado != instance.estado:
                cambios.append(f"Estado: '{equipo_previo.estado}' ➔ '{instance.estado}'")
            if equipo_previo.hostname != instance.hostname:
                cambios.append(f"Hostname: '{equipo_previo.hostname or 'N/I'}' ➔ '{instance.hostname or 'N/I'}'")
            if equipo_previo.af != instance.af:
                cambios.append(f"Activo Fijo: '{equipo_previo.af or 'N/I'}' ➔ '{instance.af or 'N/I'}'")
            if equipo_previo.marca != instance.marca or equipo_previo.modelo != instance.modelo:
                cambios.append(f"Modelo: '{equipo_previo.marca} {equipo_previo.modelo}' ➔ '{instance.marca} {instance.modelo}'")
            if equipo_previo.numero_serie != instance.numero_serie:
                cambios.append(f"N° Serie: '{equipo_previo.numero_serie}' ➔ '{instance.numero_serie}'")

            if cambios:
                prev_user_str = equipo_previo.usuario.nombre_completo if equipo_previo.usuario else 'Stock'
                new_user_str = instance.usuario.nombre_completo if instance.usuario else 'Stock'
                HistorialEquipo.objects.create(
                    equipo=instance,
                    usuario_anterior=prev_user_str,
                    usuario_nuevo=new_user_str,
                    accion=accion,
                    observacion="; ".join(cambios)
                )


@receiver(post_save, sender=Usuario)
def auto_sync_usuario(sender, instance, created, **kwargs):
    if instance.estado == 'BAJA':
        Equipamiento.objects.filter(usuario=instance).update(usuario=None, estado='STOCK', fecha_asignacion=None)

    if instance.hostname:
        Equipamiento.objects.filter(hostname__iexact=instance.hostname.strip()).update(
            usuario=instance, 
            estado='ASIGNADO'
        )