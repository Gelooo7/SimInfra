from rest_framework import serializers
from .models import Usuario, Equipamiento, HistorialEquipo, PerfilGenerico

class EquipamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamiento
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    equipos = EquipamientoSerializer(many=True, read_only=True)

    class Meta:
        model = Usuario
        fields = '__all__'

class HistorialEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialEquipo
        fields = '__all__'

class PerfilGenericoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilGenerico
        fields = '__all__'