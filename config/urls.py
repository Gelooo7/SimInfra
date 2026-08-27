from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import (
    UsuarioViewSet, 
    EquipamientoViewSet, 
    HistorialEquipoViewSet, 
    PerfilGenericoViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'equipos', EquipamientoViewSet)
router.register(r'historial', HistorialEquipoViewSet)
router.register(r'perfiles-genericos', PerfilGenericoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]