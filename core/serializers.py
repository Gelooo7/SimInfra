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

    ip_actual = serializers.SerializerMethodField()

    ip_seleccionada = serializers.IPAddressField(
        write_only=True,
        required=False,
        allow_null=True
    )

    password_gmail = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    password_simi = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    password_vpn = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = Usuario
        fields = '__all__'

    def get_ip_actual(self, obj):
        try:
            return obj.ip.direccion_ip
        except IP.DoesNotExist:
            return None

    def validate_ip_seleccionada(self, value):
        if value is None:
            return None

        try:
            ip = IP.objects.get(direccion_ip=value)
        except IP.DoesNotExist:
            raise serializers.ValidationError(
                "La IP seleccionada no existe en Gestión de IPs."
            )

        # Permitirla si ya pertenece al mismo usuario
        if ip.usuario:
            if not self.instance or ip.usuario_id != self.instance.id:
                raise serializers.ValidationError(
                    "Esta IP ya está asignada a otro usuario."
                )

        if ip.asignado_otro:
            raise serializers.ValidationError(
                "Esta IP está reservada para otro dispositivo o servicio."
            )

        return value

    def _asignar_ip(self, usuario, direccion_ip):
        # Liberar cualquier IP anterior
        IP.objects.filter(usuario=usuario).exclude(
            direccion_ip=direccion_ip
        ).update(
            usuario=None,
            estado='LIBRE'
        )

        # Asignar nueva IP
        if direccion_ip:
            IP.objects.filter(
                direccion_ip=direccion_ip
            ).update(
                usuario=usuario,
                estado='RESERVADA',
                asignado_otro=None
            )

        # Compatibilidad temporal con ip_asignada
        Usuario.objects.filter(
            pk=usuario.pk
        ).update(
            ip_asignada=direccion_ip
        )

        usuario.ip_asignada = direccion_ip

    def create(self, validated_data):
        ip_seleccionada = validated_data.pop(
            'ip_seleccionada',
            None
        )

        usuario = super().create(validated_data)

        if ip_seleccionada is not None:
            self._asignar_ip(
                usuario,
                ip_seleccionada
            )

        return usuario

    def update(self, instance, validated_data):
        ip_enviada = 'ip_seleccionada' in validated_data

        ip_seleccionada = validated_data.pop(
        'ip_seleccionada',
        None
    )

        usuario = super().update(
        instance,
        validated_data
    )

        if ip_enviada:
            self._asignar_ip(
            usuario,
            ip_seleccionada
        )

        return usuario

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.password_gmail and instance.password_gmail.startswith('ENC::'):
            data['password_gmail'] = decrypt_val(instance.password_gmail)

        if instance.password_simi and instance.password_simi.startswith('ENC::'):
            data['password_simi'] = decrypt_val(instance.password_simi)

        if instance.password_vpn and instance.password_vpn.startswith('ENC::'):
            data['password_vpn'] = decrypt_val(instance.password_vpn)

        return data

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        nombre = attrs.get('nombre_completo')
        user_red = attrs.get('usuario_red')
        correo = attrs.get('correo_corp')

        if nombre and Usuario.objects.filter(
            nombre_completo__iexact=nombre.strip()
        ).exclude(
            pk=getattr(instance, 'pk', None)
        ).exists():
            raise serializers.ValidationError({
                "nombre_completo":
                "Ya existe un usuario registrado con este Nombre Completo."
            })

        if user_red and Usuario.objects.filter(
            usuario_red__iexact=user_red.strip()
        ).exclude(
            pk=getattr(instance, 'pk', None)
        ).exists():
            raise serializers.ValidationError({
                "usuario_red":
                "Ya existe un usuario con este Usuario de Red."
            })

        if correo and Usuario.objects.filter(
            correo_corp__iexact=correo.strip()
        ).exclude(
            pk=getattr(instance, 'pk', None)
        ).exists():
            raise serializers.ValidationError({
                "correo_corp":
                "Ya existe un usuario con este Correo Corporativo."
            })

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

        if usuario and PerfilGenerico.objects.filter(
            usuario__iexact=usuario.strip()
        ).exclude(
            pk=getattr(instance, 'pk', None)
        ).exists():
            raise serializers.ValidationError({
                "usuario": "Ya existe un Perfil Genérico registrado con este Usuario."
            })

        return attrs