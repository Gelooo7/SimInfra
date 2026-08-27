from rest_framework import viewsets, filters
from .models import Usuario, Equipamiento, HistorialEquipo, PerfilGenerico
from .serializers import (
    UsuarioSerializer, 
    EquipamientoSerializer, 
    HistorialEquipoSerializer, 
    PerfilGenericoSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_completo', 'usuario_red', 'correo_corp', 'dpto_area', 'ip_asignada']

    def get_queryset(self):
        queryset = Usuario.objects.all()
        dpto = self.request.query_params.get('dpto_area', None)
        if dpto and dpto.strip():
            queryset = queryset.filter(dpto_area__icontains=dpto.strip())
        return queryset

class EquipamientoViewSet(viewsets.ModelViewSet):
    queryset = Equipamiento.objects.all()
    serializer_class = EquipamientoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['tipo', 'marca', 'modelo', 'numero_serie', 'af', 'estado']

class HistorialEquipoViewSet(viewsets.ModelViewSet):
    queryset = HistorialEquipo.objects.all()
    serializer_class = HistorialEquipoSerializer

class PerfilGenericoViewSet(viewsets.ModelViewSet):
    queryset = PerfilGenerico.objects.all()
    serializer_class = PerfilGenericoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'usuario', 'correo', 'dpto_area', 'tipo']

    def get_queryset(self):
        queryset = PerfilGenerico.objects.all()
        dpto = self.request.query_params.get('dpto_area', None)
        if dpto and dpto.strip():
            queryset = queryset.filter(dpto_area__icontains=dpto.strip())
        return queryset