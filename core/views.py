from rest_framework import viewsets, filters
from .models import Usuario, Equipamiento, HistorialEquipo, PerfilGenerico
from .serializers import UsuarioSerializer, EquipamientoSerializer, HistorialEquipoSerializer, PerfilGenericoSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('-created_at')
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_completo', 'usuario_red', 'correo_corp', 'dpto_area', 'ip_asignada']

class EquipamientoViewSet(viewsets.ModelViewSet):
    queryset = Equipamiento.objects.all()
    serializer_class = EquipamientoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['numero_serie', 'marca', 'modelo', 'tipo', 'estado']

class HistorialEquipoViewSet(viewsets.ModelViewSet):
    queryset = HistorialEquipo.objects.all()
    serializer_class = HistorialEquipoSerializer

class PerfilGenericoViewSet(viewsets.ModelViewSet):
    queryset = PerfilGenerico.objects.all()
    serializer_class = PerfilGenericoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'usuario', 'dpto_area']