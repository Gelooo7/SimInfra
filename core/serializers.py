from rest_framework import serializers
from .models import Usuario, Equipamiento, HistorialEquipo, HistorialUsuario, PerfilGenerico, IP
from .crypto import decrypt_val


class IPSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre_completo')

    class Meta:
        model = IP
        fields = '__all__'


class HistorialUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialUsuario
        fields = '__all__'


class HistorialEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialEquipo
        fields = '__all__'


class EquipamientoSerializer(serializers.ModelSerializer):
    usuario_red = serializers.ReadOnlyField(source='usuario.usuario_red')
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre_completo')
    historial = HistorialEquipoSerializer(many=True, read_only=True)
    icloud_password = serializers.SerializerMethodField()

    class Meta:
        model = Equipamiento
        fields = '__all__'

    def get_icloud_password(self, obj):
        if obj.icloud_password and obj.icloud_password.startswith('ENC::'):
            return decrypt_val(obj.icloud_password)
        return obj.icloud_password

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        serie = attrs.get('numero_serie')
        af = attrs.get('af')

        if serie and Equipamiento.objects.filter(numero_serie__iexact=serie.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"numero_serie": "Ya existe un equipo registrado con este N° de Serie."})

        if af and Equipamiento.objects.filter(af__iexact=af.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"af": "Ya existe un equipo registrado con este Activo Fijo (AF)."})

        return attrs


class UsuarioSerializer(serializers.ModelSerializer):
    equipos = EquipamientoSerializer(many=True, read_only=True)
    historial = HistorialUsuarioSerializer(many=True, read_only=True)
    password_gmail = serializers.SerializerMethodField()
    password_simi = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = '__all__'

    def get_password_gmail(self, obj):
        if obj.password_gmail and obj.password_gmail.startswith('ENC::'):
            return decrypt_val(obj.password_gmail)
        return obj.password_gmail

    def get_password_simi(self, obj):
        if obj.password_simi and obj.password_simi.startswith('ENC::'):
            return decrypt_val(obj.password_simi)
        return obj.password_simi

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        nombre = attrs.get('nombre_completo')
        user_red = attrs.get('usuario_red')
        correo = attrs.get('correo_corp')

        if nombre and Usuario.objects.filter(nombre_completo__iexact=nombre.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"nombre_completo": "Ya existe un usuario registrado con este Nombre Completo."})

        if user_red and Usuario.objects.filter(usuario_red__iexact=user_red.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"usuario_red": "Ya existe un usuario con este Usuario de Red."})

        if correo and Usuario.objects.filter(correo_corp__iexact=correo.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"correo_corp": "Ya existe un usuario con este Correo Corporativo."})

        return attrs


class PerfilGenericoSerializer(serializers.ModelSerializer):
    password = serializers.SerializerMethodField()

    class Meta:
        model = PerfilGenerico
        fields = '__all__'

    def get_password(self, obj):
        if obj.password and obj.password.startswith('ENC::'):
            return decrypt_val(obj.password)
        return obj.password

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        usuario = attrs.get('usuario')
        if usuario and PerfilGenerico.objects.filter(usuario__iexact=usuario.strip()).exclude(pk=getattr(instance, 'pk', None)).exists():
            raise serializers.ValidationError({"usuario": "Ya existe un Perfil Genérico registrado con este Usuario."})
        return attrs