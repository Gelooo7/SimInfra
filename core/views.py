from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Usuario,
    Equipamiento,
    PerfilGenerico,
    IP,
    Anexo,
)

from .serializers import (
    UsuarioSerializer,
    EquipamientoSerializer,
    PerfilGenericoSerializer,
    IPSerializer,
    AnexoSerializer,
)


class IPViewSet(viewsets.ModelViewSet):
    queryset = IP.objects.all()
    serializer_class = IPSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado']
    search_fields = [
        'direccion_ip',
        'observacion',
        'usuario__nombre_completo',
        'asignado_otro'
    ]


class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.select_related('usuario').all()
    serializer_class = AnexoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado']
    search_fields = [
        'numero_anexo',
        'exterior',
        'observaciones',
        'usuario__nombre_completo',
        'usuario__dpto_area',
        'usuario__cargo',
        'usuario__correo_corp',
    ]


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['dpto_area', 'estado']
    search_fields = [
        'nombre_completo',
        'usuario_red',
        'correo_corp',
        'hostname',
        'ip__direccion_ip'
    ]


class EquipamientoViewSet(viewsets.ModelViewSet):
    queryset = Equipamiento.objects.all()
    serializer_class = EquipamientoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo', 'estado']
    search_fields = [
        'marca',
        'modelo',
        'numero_serie',
        'hostname',
        'af',
        'usuario__nombre_completo',
        'usuario__usuario_red'
    ]


class PerfilGenericoViewSet(viewsets.ModelViewSet):
    queryset = PerfilGenerico.objects.all()
    serializer_class = PerfilGenericoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['dpto_area', 'tipo', 'estado']
    search_fields = ['nombre', 'usuario', 'correo']

    def get_queryset(self):
        queryset = PerfilGenerico.objects.all()
        dpto = self.request.query_params.get('dpto_area', None)

        if dpto and dpto.strip():
            queryset = queryset.filter(
                dpto_area__icontains=dpto.strip()
            )

        return queryset