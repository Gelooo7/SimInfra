from django.db import models

class Usuario(models.Model):
    nombre_completo = models.CharField(max_length=150)
    correo_corp = models.EmailField(unique=True)
    dpto_area = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    ip_asignada = models.GenericIPAddressField(null=True, blank=True)
    usuario_red = models.CharField(max_length=50, unique=True)
    hostname = models.CharField(max_length=100, null=True, blank=True)
    gmail = models.EmailField(null=True, blank=True)
    pwd_gmail = models.CharField(max_length=128, null=True, blank=True)
    vpn_cisco = models.BooleanField(default=False)
    sif = models.BooleanField(default=False)
    anexo_exterior = models.CharField(max_length=50, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre_completo} ({self.usuario_red})"


class Equipamiento(models.Model):
    TIPO_CHOICES = [
        ('NTBK', 'Notebook'),
        ('CEL', 'Celular'),
        ('TBIT', 'Tablet/Tbit'),
        ('BAM', 'BAM'),
        ('OTRO', 'Otro'),
    ]

    ESTADO_CHOICES = [
        ('ASIGNADO', 'Asignado'),
        ('DISPONIBLE', 'Disponible'),
        ('REPARACION', 'En Reparación'),
        ('BAJA', 'Dado de Baja'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipos')
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    perifericos = models.TextField(null=True, blank=True)
    numero_serie = models.CharField(max_length=100, unique=True)
    af = models.CharField(max_length=100, null=True, blank=True, verbose_name="Activo Fijo")
    fecha_entrega = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='DISPONIBLE')

    def __str__(self):
        return f"{self.tipo} - {self.marca} {self.modelo} ({self.numero_serie})"


class HistorialEquipo(models.Model):
    equipo = models.ForeignKey(Equipamiento, on_delete=models.CASCADE, related_name='historial')
    usuario_anterior = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50)

    def __str__(self):
        return f"Historial {self.equipo.numero_serie}"


class PerfilGenerico(models.Model):
    nombre = models.CharField(max_length=150, null=True, blank=True)
    usuario = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100, null=True, blank=True)
    correo = models.EmailField(null=True, blank=True)
    dpto_area = models.CharField(max_length=100, null=True, blank=True)
    tipo = models.CharField(max_length=20, default='ONPREMISE')

    def __str__(self):
        return f"{self.nombre or self.usuario} ({self.usuario})"

    