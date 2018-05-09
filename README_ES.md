Sentinel
===
### Una red con interoperatividad para servicios distribuidos

_____________________
![Sentinel Security Group](https://raw.githubusercontent.com/sentinel-official/sentinel/master/docs/Sentinel%20Security%20Group_LitePaper%20v10%20001.jpg)
_____________________

La Motivación
--

El primer paso para ejecutar la visión fue crear un gran incentivo de ancho de banda y
protocolo de monitoreo de recursos. Para poder trabajar para completar este paso de
fundación, Sentinel ha lanzado un prototipo de cliente VPN, con la intención de facilitar
el monitoreo y el incentivo de datos entre un nodo host y un usuario final.

Basado en tecnología interoperable de blockchain, la red de Sentinel pretende usar
cadenas múltiples para:

- gestionar la identidad
- gobernar y llevar a cabo servicios con incentivo de recursos
- procesar pagos

Características de Sentinel
---

- **Distribuido, ningún nodo almacena datos completos**

  - La retención de datos en la red es mínima, ya que está incompleta. Todo
lo que posee cada nodo puede ser visto sólo por su dueño; teniendo su
hash correspondiente.

  - Los datos de identificación de usuarios se almacenan en una cadena
separada. (AUID). De este tema se habla más adelante.

  - Consenso basado en BFT, usando el TenderMint Consensus Engine; con
capacidad de trabajar con más de 2/3 de los nodos fallando.

  - Cualquier ataque a la red activará la escalabilidad automática y la
reubicación de la red y aislamiento de los nodos afectados.

- **Desarrollo (SDK)**

  - Pruebas e implementaciones rápidas, porque los nodos de servicio
proporcionan recursos físicos, a diferencia de los servidores centrales,
que son muy caros y requieren muchos recursos.

  - Fácil acceso de uso final. Servicios y Apps pueden ser comercializadas en
el mercado.

- **Utiliza un solo cliente de ordenador/móvil para conectarse a todos los servicios.**

  - Actualmente utiliza un sólo punto de acceso para agilizar los servicios.
  
  - Esto puede que se separe en el futuro.
  - Los usuarios pueden ser incentivados si se convierten en nodos
proveedores de servicios y mantienen una buena reputación.

  - AUID (Anonymous user identification), en español Identificación
anónima de usuario. Este tema, que se tratará más adelante, emplea un
incentivo basado en la reputación.

  - dVPN es la primera implementación de servicios nativos y
  
    - Los desarrolladores pueden implementar el SDK de Sentinel en
sus propias aplicaciones.

    - Pueden vender y comercializar aplicaciones y servicios en el
Mercado de Servicios de Sentinel.

Arquitectura de Sentinel
=

*Sentinel* emplea lo que se llama una arquitectura de multi-cadena y tiene recursos para
asegurar el intercambio de datos entre personas y aplicaciones (Legacy), aplicaciones
empresariales, aplicaciones móviles y dApps.

La red resuelve problemas con la infraestructura y la escala, logrando de este modo la
velocidad del nivel de producción de la transacción implementando:

- **Arquitectura Multicadena**

- **Cadena de Identidad** – Una identidad de usuario anónimo (AUID) se crea y se
    almacena en una cadena independiente, la cual interactúa con las otras cadenas
    para proporcionar acceso a servicios en la Cadena de Servicios y para procesar
    pagos en la Cadena de Transacción.

- **Cadena de Servicios** - Túneles seguros de datos con una capa subyacente y una red de
retransmisión superpuesta. La gobernanza se implementará en la parte superior de la
cadena de servicios y una ficha de identificación, llamada ficha de servicio centinela ($
SENT-SST) será la ficha de utilidad utilizada para las transacciones en la cadena de
servicios.

- **Cadena de transacciones de Sentinel** - Pagos y procesamiento relacionado de
transacciones desde y hacia el grupo de transacciones de Sentinel.

Cadena de Identidad e ID de Usuario Anónimo (AUID)
===

- La Identidad de Usuario anónimo será la única fuente de acceso para todos los
    servicios en la red Sentinel.
    
- La red estará gobernada por la reputación. Cuanto más grande sea ésta, más
    fácil será el acceso a los Servicios y a los masternodes.
    
- La red tiene incentivos monetarios para un comportamiento adecuado, donde
    una mayor reputación significará un mayor potencial de ganancia.
    
- AUID no almacena ningún tipo de información a menos que sea necesario y que
    se proporcione por los propios usuarios.
    
- Resuelve el problema de un único punto de fallo, distribuyendo el AUID del
    ledger a través de la red de nodos de Sentinel.
    
- Aquellos que hagan acciones no apropiadas se arriesgan en reducir su reputación si se involucran en envío de spam o actividad maliciosa.

- El mecanismo de consenso distribuido de la red reconoce rápida y eficazmente las identidades comprometidas. Las soluciones automáticas se activarán y mitigarán las posibles amenazas para que la red no pueda verse afectada.

- Eficiente gestión de identidad específica de la aplicación

Cadena de Servicio de Sentinel
=

Sentinel Security Suite
-
El Sentinel Security Suite es un set de productos desarrollados por la comunidad Sentinel
y el equipo central y funciona utilizando protocolos y el SDK de la red Sentinel.

Acceso seguro - dVPN
-

Una red privada virtual descentralizada impulsada por tecnología de blockchain. El dVPN
(Red privada virtual descentralizada) es el primer caso de uso construido en la bockchain
con una tipología de red extremadamente distribuida con nodos que abarcan todos los
continentes.

Cada nodo puede ser un ordenador de mesa / portátil, un teléfono móvil o bien un
servidor en la nube. El ledger contiene datos de transacciones y se almacenan en
blockchain con un sistema de consenso “Proof-of-Traffic”, que incentiva a los usuarios
principalmente para el ancho de banda servido y monetiza cualquier ancho de banda no
utilizado que puedan declarar en la red Sentinel.


### La necesidad de una plataforma de servicios segura

Servicios de Internet más utilizados por los usuarios:

- **Información agregada**

  - Google, Microsoft, Apple, Facebook requieren que el usuario divulgue
información para registrarse y para poder usar sus servicios.

- **Comprar / Vender y comerciar datos de usuario**

  - Incluso si uno no se suscribe a ninguno de los servicios de los recopiladores de
datos mencionados anteriormente, se sigue siendo propenso a ser rastreado
mediante cookies.

  - Big.exchange es una de esas plataformas que comercia legalmente en cookies de
usuario por dinero.

- **Son impotentes para la ley legislativa**

  - La US CLOUD Act enmienda la Ley de Comunicaciones Almacenadas para permitir
que las autoridades federales obliguen a los proveedores de servicios de los EEUU
mediante una orden o una citación judicial a proporcionar los datos solicitados
almacenados en servidores, independientemente de si se encuentran dentro de los
EEUU o en países extranjeros.

  - En el año 200 China aprobó dos leyes de censura que permiten a su gobierno
monitorear y rastrear la comunicación y también permiten denegar el acceso a
diversos sitios web escolares o académicos y servicios de intercambio de medios.

- **Son dependientes de los servidores centrales, cuyo fallo puede causar un fallo completo de la red**

  - Los ataques de hackers, de bot-net, ataques DDOS de gobierno, ataques de
proliferación de nodos son algunos de los muchos ataques que han demostrado que
paralizan las granjas de servidores. La pérdida, o incluso el tiempo de inactividad
pueden causar consecuencias catastróficas. Por ejemplo; Una interrupción de 10
segundos en una plataforma central de comercio basada en servidores puede causar
pérdidas de millones de dólares.

Considerando esto, necesitamos:

- Una capa de desarrollo de servicios que no sea centralmente dependiente. Este
    servicio debería permitir un fácil intercambio de recursos, así como también un
    fácil desarrollo.
    
- Un medio para un acceso segura a esta red y eludir así el derecho legislativo local
    e internacional.
    
- Un medio para asegurarse de que los datos del usuario sean seguros, privados y
    anónimos.

Se puede encontrar una versión operativa de Sentinel Desktop Client (actualmente en
alfa) en la página de lanzamientos del perfil de GitHub.

**NOTA:** Esta versión es solo una prueba de concepto y está solamente destinada a probar
la funcionalidad de dVPN y el protocolo de incentivación de recursos (con fijación
dinámica de nodos). Úselo bajo su propio riesgo y responsabilidad.

Estamos trabajando para lograr un dVPN completamente funcional que podamos
utilizar regularmente todos los días para enviar todo el “home traffic” a través de él,
pero ahora todavía no es el momento.

En caso de tener cualquier problema con el actual Sentinel Desktop Client, infórmenos
mediante la presentación de un problema en GitHub o iniciando una conversación
con el bot de Telegram y enviando el problema directamente a él - @SentinelSupportBot 


**Hoja de ruta para el dVPN**

Además de dVPN, Sentinel también planea trabajar en una imagen y firmware que se
requiere para configurarlo en una caja que toma Ethernet como entrada y se conecta al
router en el hogar / oficina. De esta manera, todo el tráfico que pasa a través del router
pasa por la VPN. Esta caja también ayuda a la monetización eficiente del ancho de banda
de la red, ya que esta caja consume una parte de la energía que consume un PC.

Comunicación segura (Sentrix)
-

Sentrix es la respuesta de Sentinel a las crecientes preocupaciones de privacidad en
lo que se refiere a los servicios de comunicación centralizados que almacenan información
confidencial del usuario. Facebook, WhatsApp, Google etc. Estarían dentro de esta
categoría.

Sentrix es un paquete de comunicación seguro que se ejecuta en la cadena de servicio
Sentinel, que utiliza la potencia de una red descentralizada y “peer-to-peer” (de igual a
igual), que ha sido desarrollada utilizando protocolos de comunicación comprobados,
como por ejemplo el Protocolo de Comunicación de Matrix (Referencias 1,2)


¿De qué forma parte Sentrix?

- dChat
- dVoIP

Sentrix operará sin un DNS y, por eso, está completamente descentralizado, operando
solo de igual a igual con la máxima seguridad utilizando algoritmos de Ratchet como
OLM, MegOLM y demás.

La duración de un mensaje en Sentrix es finita. A partir de entonces, todos los mensajes
que superen ese límite finito serán eliminados de los servidores en toda la red. Se
proporcionará una opción de respaldo como parte del Cliente de ordenador o móvil,
donde los mensajes serán cifrados y guardados localmente. Este tiempo finito
podría ser inicialmente decidido por la red. Más adelante, los usuarios tendrán la opción
de definirlo ellos mismos.

Implementación de servicios en la Cadena de Servicios
---

Hay dos tipos de servicios en la Red Sentinel.

1 - Servicios nativos

2 - Servicios distribuidos externos/de terceros (centralizados y descentralizados)

Los Servicios Nativos son desarrollados por la Comunidad Sentinel y trabajarán para la
implementación exitosa de los mismos.

Cifrado de extremo a extremo con consenso basado en BFT
--

Un problema común que se plantea en la privacidad y, especialmente en los proyectos
VPN o proyectos distribuidos de redes anónimas es la posible presencia de malos actores
o de nodos maliciosos. Mientras que el tráfico se cifra entre el nodo de entrada y el nodo
de salida y se pasa a través de varios métodos de túnel cerrado, siempre existe la
pregunta de si el nodo de salida puede ser malicioso y puede recoger otras variables de
red de la sesión de usuario que podrían ayudar al actor malicioso a generar una huella
digital de usuario.

Actualmente, este problema lo abordan redes como TOR e i2p, donde hay un relevo de
paquetes y utiliza técnicas de enrutamiento de paquetes para garantizar que no se
revele la identidad de la fuente y el destino.

Sentinel está desarrollando una red de retransmisión en la cual los participantes de la
red pueden elegir ser un retransmisor o un nodo de salida en el cual los túneles
cifrados trafican entre el usuario VPN pagado y un nodo de salida.


Un mecanismo de consenso junto con el enrutamiento de paquetes híbridos
---

Sentinel construirá una red de retransmisión que implicará el uso de nodos de
gobernanza que determinará la ruta de transmisión de paquetes entre el usuario y el
nodo de salida.

Lo hará analizando diferentes factores de entrada para determinar la mejor ruta de
retransmisión, cómo por ejemplo:

- “Hops” solicitados por el usuario
- Reputación y latencia de relés
- Solicitudes de estandarización de paquetes
- Capacidad de elegir
- Túneles directos, relé

Mezclador anónimo
---

Cuando un usuario desea usar Sentinel dVPN o algún otro servicio, el usuario tendría
que realizar un 'Cambio de servicio' enviando SENT (ENVIADO) en la billetera de
intercambio. Esto activará un contrato inteligente ETH que emitiría los tokens del
usuario en la 'Cadena de servicio' a sus direcciones predefinidas.

Por ejemplo:

- El usuario A establece una relación entre la Dirección de la Cadena #2 hacia la
billetera de SENT. El usuario A manda 50 $ SENT al nodo de intercambio de Sentinel.
- El nodo de intercambio de Sentinel recibirá la entrada de la dirección de la cadena #
desde la billetera del usuario A y desencadenará una salida de la cadena #2 del API de
la blockchain.
- Esto dará como resultado una transacción desde el nodo de intercambio de la cadena
#2 a la cadena del monedero del usuario #2, en un ratio de 1:1 entre $SENT y $SST.
- El usuario A entonces usará un servicio, como el dVPN, y mandará 5 $SST al
proveedor B.
- El proveedor B desea convertir 50 $SST en $SENTs y envía lo mismo a la dirección de
intercambio en la 'cadena de servicio de Sentinel'.
- Esto desencadena un contrato inteligente que dará como resultado que el Proveedor
B reciba 50 $ SENT en su billetera de cadena de transacción de Sentinel predefinida.

Gobernabilidad en la Cadena de Servicio: Protocolo de Incentivación de Recursos
----

El modelo de ofrecer servicios y facturación por transacción genera la necesidad de
mecanismos de gobierno más eficientes y eficientes. A continuación se mencionarán los
tipos de bloques que se utilizan durante la prestación del servicio en la Red Sentinel.

#1 Bloque de servicio
-
Estos son bloques de raíz, desde de los cuales se generan bloques de registro de servicio.
Estos bloques son creados por el nodo Sentinel.

#2 Bloque de registro de servicio (creado por los consumidores)
-
Una vez que un consumidor solicita un servicio a través de la billetera (wallet), el
consumidor genera un bloque de registro de servicio.

#3 Service Moderation Block (creado por los proveedores de servicios)
-
Una vez que la demanda es generada por el bloque de registro del servicio, el proveedor
del servicio genera un bloque de moderación que esencialmente registra los servicios
facilitados por el servicio proporcionado y los registros de incentivación.

#4 Individual (si está centralizado)
-
Si una sola entidad o empresa aloja el servicio, el Servicio y el Nodo se ejecutan según
los términos y condiciones del Proveedor de servicios. Para servicios como este, la
moderación está completamente controlada por la entidad individual y, en función de
la aprobación, se crea un bloque de autorización, que está por defecto en el estado no
aprobado hasta el consentimiento del consumidor / usuario.

#5 Miner / Node / Provider Pool (si está descentralizado)
-
Si un servicio es de naturaleza descentralizada y tiene que ejecutarse a través de un
conjunto de minero / nodo para fines de gobernanza, estos bloques se crean y se
aprueban, hay un Bloque de autorización que se crea de manera predeterminada en el
Estado no aprobado hasta que el Consumidor / Consumidor da su consentimiento.

#6 Bloque de autorización (estado no aprobado)
-
Este es el bloque creado para que el consumidor / usuario apruebe el comienzo de un
servicio. La autorización o aprobación significa que el servicio puede comenzar a facturar
por los servicios utilizados.

#7 Start Block
-
Una vez que un consumidor / usuario aprueba el inicio de la facturación de un servicio,
este bloque se crea indicando esto mismo. Este bloque es la referencia primaria para la
cadena que indica el estado de un servicio en relación con el consumidor / usuario.

#8 Stop Block
-
Una vez que un Consumidor / Usuario cancela la facturación de un servicio, este bloque
se crea para indicarlo. Este bloque es la referencia primaria para la cadena que indica el
estado de un servicio en relación con un consumidor / usuario. No se puede crear un
bloque de detención (stop block) en el caso de un bloque no pagado existente.

#9 Service Block
-
Cada transacción en la cadena de servicios implica el intercambio de activos: recursos
por valor monetario. Esta transacción en esencia comprende la red y cada bloque de
servicio en la cadena de servicios capta esta información. Cada servicio tendrá diferentes
datos capturados y el equipo está trabajando en una forma de empaquetarlos a todos
en la cadena que se está siendo desarrollado utilizando TenderMint.

#10 Pagado
-
Este bloque se crea después de que un consumidor / usuario inicie y complete la
transacción a un proveedor de servicios. Para los modelos prepagos, se crea primero un
bloque pagado antes de crear un bloque no pagado.

#11 Sin pagar
-
Este bloque se crea después de que se utilice un servicio o en forma de pre-pago de
gobierno, se crea antes de que un consumidor / usuario comience a usar el servicio. En
una forma de Gobernanza post-pago, se crea después de la utilización de un servicio.

Si hay un bloque no pagado en la Cadena de Servicio para un Consumidor / Usuario
específico, no será posible la suspensión del mismo y el Consumidor / Usuario perderá
las monedas apostadas para usar el servicio y también perderá reputación.

#12 Hold
-
Este bloque se crea cuando un usuario envía un pago a un proveedor de servicios. El
pago se envía primero al Grupo de transacciones de Sentinel de los pagos actuales y es
allí donde se procesa para posteriormente enviarlo al Proveedor de servicios.

#13 Disputa
-
Este bloque se crea cuando un consumidor / usuario tiene un problema con un
proveedor de servicios. La comunicación entre el Proveedor de servicios y el usuario es
clave y, por lo tanto, formará parte de la Cadena de servicios cuando se lance Secure
Communication Suite.

La provisión para que esto suceda se está acomodando en el escritorio y los clientes
nativos. Durante una disputa, cada una de las partes la resolverá entre ellos y quien haya
presentado la solicitud deberá marcar el problema como resuelto.

Durante una disputa, la suspensión de un servicio no será posible, es decir, no se
generará un bloque de detención.

#14 Resuelto
-
Estos bloques se crean una vez que un problema, previamente en el estado Disputa, se
ha marcado como Resuelto por el emisor.

#15 Microtransacciones
-
Cada transacción pasa por el conjunto de transacciones y luego se distribuye al receptor,
tanto de igual a igual (peer-to-peer) como al proveedor de servicios.

Las transacciones se envían a los contratos inteligentes definidos por el usuario basados
en el grupo y los Canales de Estado se utilizan para crear sesiones entre:

- *Remitente* (*Wallet* de usuario o Monedero del proveedor de servicios) al  *Grupo de
transacciones*
- Desde el *grupo de transacciones* al destinatario (wallet de proveedor de servicios (O)
del usuario)

Cadena de transacciones de Sentinel
===

- La cadena de transacciones de Sentinel permite a los usuarios pagar de forma segura los
servicios utilizando su AUID y carteras relacionadas.
- Las transacciones en esta cadena están respaldadas por contratos inteligentes basados
en Solidez en la Cadena Ethereum. Estas transacciones son validadas por mineros en la
red Ethereum.
- Los Masternode tendrán la capacidad de ejecutar nodos para validar y asegurar la
red.

Notas adicionales
===

Características actuales
---

La primera implementación de Sentinel en la cadena de servicios es un servicio VPN
descentralizado realmente seguro. Esta VPN se basa en una tecnología de igual a igual
(peer-to-peer). Esto significa que la red se ejecuta debido al apoyo de las personas en
lugar de en un servidor central. Los servidores centralizados pueden ser monitoreados
por un gobierno y pueden ser derribados por hackers.

El servicio dVPN de Sentinel permite que una persona use el servicio VPN o ayude a la
VPN al compartir Internet gratuito y sin usar con otras personas en la red. Esto se hace
de una manera muy segura con tecnologías vanguardistas.

La persona que comparte su internet con otras personas se llama Nodo. El nodo puede
elegir el precio de Internet que comparte. Esto es hecho por nuestra criptomoneda que
se llama Token Centinela, representado por $ SENT.
Por ejemplo; El nodo que comparte su internet con otros puede cobrar a los usuarios en
$ SENT por cada Gigabyte de internet compartido o simplemente, $ SENTs / GB.

Actualmente hay más de 20 de estos nodos que comparten Internet seguro en nuestra
red y este número crece diariamente. Multitud de personas están probando nuestro
servicio VPN e informando muy buenos resultados.

Nuestra red vive en Ethereum Rinkeby Testnet en este momento, hasta que lanzamos
nuestro producto final.

Nuestra tecnología VPN es muy especial y única porque es la primera vez que se utiliza
la tecnología blockchain para la seguridad de Internet. Nuestro sistema de fijación de
precios (Sents / GB) es la primera vez que se usa una blockchain de esta manera. Toda
la comunicación en una red blockchain se lleva a cabo a través de un método llamado
"Smart Contracts". Los contratos inteligentes de Sentinel para medir el uso y el uso
compartido de Internet son muy precisos. Esta implementación de contratos
inteligentes para cobrar a los usuarios la cantidad precisa por su uso de Internet nunca
se ha hecho antes de usar la tecnología blockchain.

Los usuarios que utilizan Internet seguro y los usuarios que comparten Internet seguro
se miden con mucho cuidado. Si algún usuario no paga después de usar Internet seguro
desde un nodo, su cuenta será bloqueada. A veces incluso se le prohibirá el acceso.

Plan de desarrollo futuro
--

En el futuro, Sentinel proporcionará las siguientes funciones a la red:

1) **Nodos TOR de capa 2 y masternodes**

    - El prototipo actual de VPN descentralizado (dVPN) pretende mostrar la funcionalidad de
los protocolos de ancho de banda basados en blockchain. Este prototipo no es más
seguro que su cliente VPN convencional. Ahora está comenzando el trabajo hacia la
privacidad.

    - Los nodos de entrada LaTOR 2TOR serán el primer caso de uso verdaderamente
anónimo para dVPN, ya que los nodos de entrada TOR deben ejecutar la misma versión
de acoplador sumada para ser un proveedor de servicios en la red, demostrando al
usuario que todo el tráfico está siendo enrutado directamente a TOR.

    - Esta característica también proporciona inmunidad a los proveedores de nodo de salida,
ya que se convertirán en un nodo de entrada a una red de capa 2.

    - Este sistema masternode está actualmente centralizado y depende de un servidor
alojado por los desarrolladores para fines de prueba. Durante el TestDrop hubo una
sobrecarga completa de la red hasta el punto que no se había experimentado antes.
Hubo más de 75 sesiones de usuario activas en un punto para el que no estaba
preparado el servidor masternode centralmente alojado. Esto condujo a la pérdida de
funciones clave del usuario durante un determinado período de tiempo.

    - El sistema de masternode se descentralizará parcialmente en la actualización v0.0.
ya que los miembros de la comunidad de confianza podrán ejecutar el masternode en
la Testnet de SENT en Rinkeby para introducir capas de provisión de redundancia y
esfuerzos adicionales hacia una validación de consenso.

    - El objetivo final de esta secuencia de acciones es descentralizar por completo el sistema
de masternodes.

2) **Intercambios en cadena centralizados**

    - Para poder usar la red Sentinel, se deberán adquirir tokens y, con la introducción a los
swaps ERC20 en cadena, los usuarios de Sentinel podrán utilizar tokens TestNet ERC
como $ ETH, $ OMG, $ GNT y $ ZRX para canjearlos por Sentinel ($ SENT) directamente
desde dentro de la wallet. Más detalles sobre esto en una publicación independiente
durante el lanzamiento.

3) **Estandarización de paquetes en la red Sentinel**

    - La estandarización de paquetes dificulta que los hackers o las personas jurídicas
encuentren sus datos entre todos los datos en Internet.

4) **Mezclador anónimo**

    - Esta función combinará la identificación del usuario para que nadie sepa su identidad
mientras navega.

5) **Sistema de chat / mensajería descentralizado (dChat)**

    - Ya hemos comenzado a probar nuestra plataforma de mensajería basada en la
tecnología blockchain. Es muy seguro, seguro y rápido.

6) **VoIP / llamadas descentralizadas (dVoIP)**

    - En el futuro, los usuarios podrán hacer llamadas de voz en nuestra red distribuïda.

    - Los sistemas descentralizados de chat y VoIP están siendo desarrolladoos en el servidor
Matrix y se llamarán Sentrix (que es la abreviatura de Sentinel + Matrix)

7) **Protocolo de incentivo de recursos para incentivar el ancho de banda, almacenamiento e informática**

    - En el futuro, las personas podrán compartir más que solo Internet seguro en la red
Sentinel. P.ej; En el futuro, podrá compartir almacenamiento adicional, potencia de CPU
de repuesto. Puede cargar por compartir el almacenamiento adicional o la potencia de
cálculo en SENTADOS.

8) **Cajas de hardware para acceso seguro a múltiples dispositivos**

    - Hemos comenzado a probar una caja de hardware que podemos conectar a un
enrutador. Esto permitirá que cualquier dispositivo conectado al enrutador use Internet
seguro y otros servicios en nuestra red.

Beneficios de las características desarrolladas por Sentinel
-

La privacidad hoy está en peligro, bajo ataque. No podemos estar completamente
seguros ni del gobierno ni de los piratas informáticos utilizando las herramientas
corrientes disponibles hoy en día. Sentinel utiliza el poder de la tecnología blockchain
para ofrecer excelentes herramientas que funcionen eficazmente para proteger su
privacidad en Internet. Tiene muchos otros servicios de privacidad en la red que se han
desarrollado teniendo en cuenta su privacidad y seguridad.

Algunas de estas características útiles son:

* AUID (Identificación de usuario anónimo)
    * En nuestra red, le damos a cada usuario una identificación de usuario especial. Un
usuario no puede tener más de una de estas ID. El usuario puede acceder a todos los
servicios en nuestra red usando esta ID. No se almacenan ni registran datos de usuario.

* Un Internet gratis
    * Los usuarios pueden navegar por muchos sitios web que generalmente están
bloqueados en algunos países. Por ejemplo: Si realiza un viaje de negocios a China y
desea consultar el sitio web de su compañía. (La mayoría de los sitios web de las
empresas están bloqueados en China).

* Muchos servicios de muchas personas en nuestro mercado de servicios
    * En el futuro, nuestra red tendrá un mercado abierto para servicios. Los desarrolladores
pueden compartir, vender sus servicios aquí y los usuarios pueden acceder a ellos.

¿Cómo puede un usuario alojar un nodo o ser parte de la red?
-

Los usuarios pueden alojar nodos siguiendo las instrucciones aquí o siguiendo los
comandos a continuación si están en cualquier sistema Linux con `curl`, `Docker` y
`OpenVPN` instalados previamente.

**Paso 1**

Vaya a la carpeta raíz de un usuario con el siguiente comando.

`cd ~`

**Paso 2**

Crea un directorio en la carpeta

`mkdir -p $HOME/.sentinel`

**Paso 3**

Ejecutar docker, obtener y ejecutar Sentinel

`sudo docker run -it --privileged --mount type=bind, source=$HOME/.sentinel, target=/root/.sentinel -p 3000:3000 -p 1194:1194/udp sentinelofficial/sentinel-vpn-node`

Si tiene algún problema, envíenos un mensaje por Telegram o publique un problema en
el repositorio de GitHub directamente.

¿En qué se diferencia Sentinel de Substratum, Mysterium, Privatix y otros competidores de VPN?
-

Sentinel es muy diferente de Mysterium, Privatix, etc... Puede usar servicios VPN en
Sentinel y también puede usar muchos servicios útiles, como dChat, dVOIP, dDNS, etc.
Todos estos servicios están también disponibles en la capa de red de Sentinel. En breves
lanzaremos un kit de desarrollo de software para desarrolladores para que otras
personas también puedan realizar servicios útiles para nuestra red. Podemos usar
Sentinel dVPN con estos servicios para asegurarnos de que el servicio sea
completamente seguro y anónimo.

El equipo de desarrollo de Sentinel está trabajando para ofrecerte el kit de desarrollo de
software. Actualmente estamos usando este kit de desarrollo para brindarle estos
servicios:


- Chat descentralizado (dChat)
    - Para chatear con tus amigos sin guardar ningún registro. P.ej; China y Siria han aprobado
leyes para mantener registros de chats e identidades también

- Protocolo descentralizado de voz sobre Internet (dVoIP)
    - Al igual que Skype, pero más seguro.

- Mezclador anónimo 
    - Enviar tokens a las pool cuando no se usen y mezclarlos hasta
que se retiren

- Mercado de servicios descentralizados
    - Un mercado de servicios seguros para garantizar que la demanda satisfaga el suministro,
cómodamente. Cada proveedor de servicios puede utilizar un servicio nativo o de un
tercero y alojarlo para obtener incentivos para compartir recursos.

Nuestros servicios de chat, VOIP y almacenamiento son realmente valiosos. Le
brindaremos estos servicios en un paquete llamado "Paquete de servicios seguros de
Sentinel". Está planeado lanzar esto antes de fin de año. También lanzaremos nuestro
kit de desarrollo de software en ese momento.

Estos servicios distribuidos pueden enfocarse primero en la privacidad o en la
transferencia de datos cifrados. Tomará la ruta SaaS de ofrecer VPN por un precio fijo.

Tenemos una visión a largo plazo para proporcionar el servicio VPN más seguro además
de ofrecer más servicios descritos anteriormente. Tendremos soluciones de nivel
Enterprise. En el futuro, tanto personas como empresas utilizarán dAPP y servicios que
vivan en la red Sentinel.

En nuestra línea de tiempo, prometimos que haríamos un dispositivo de hardware para
conectarnos a un router y compartir internet seguro con todos los dispositivos
conectados a este router. Estamos muy entusiasmados con este dispositivo y creemos
que puede cambiar el mundo.

Como se menciona en la hoja de ruta, Sentinel apunta a encriptar los datos que fluyen
a través de múltiples dispositivos usando una caja de hardware, que tomará la
información del proveedor de internet y se conectará a un enrutador. Por lo tanto, todos
los datos que fluyen a través del enrutador serán cifrados. Esta caja de hardware es
un gran paso para darnos cuenta de lo que vemos como el futuro potencial.


Usos del contrato inteligente de Sentinel en otras industrias
-

Cuando un usuario usa internet seguro, se llama una "transacción". Los usuarios pueden
acordar la cantidad que están dispuestos a pagar por una transacción. Cuando los
usuarios usan suficiente Internet segura, por ejemplo; 1GB o 1TB, el usuario tiene que
pagar esta cantidad al Nodo Maestro en la red. El nodo maestro tomará una pequeña
tarifa de transacción y luego enviará la cantidad restante al nodo proveedor de servicios.

Este método es muy fácil de implementar en muchas industrias:

El dinero que se ha gastado en esto será recolectado por el Nodo Maestro, con una tarifa
de transacción menor por él, que se distribuirá a masternodes (nodos que ejecutan
la Red Sentinel y sistemas de gobierno relacionados) y Nodos de Proveedor de Servicios
(nodos que ejecutar todo el servicio)

El modelo de recursos del sistema de medición e incentivo (como ancho de banda,
almacenamiento, informática) se puede utilizar en múltiples industrias:

1) Telecom: todas las comunicaciones que usan el Protocolo de Internet o cualquier
protocolo digital se pueden cargar solo por usar ancho de banda y
almacenamiento

2) Medios de comunicación: compartir información con periodistas y personas
similares, ya sea para denuncia o simplemente para una comunicación segura.

3) Comunicaciones corporativas: compartir información con el equipo y las juntas
sin el conocimiento de las personas dentro de la organización. Es bastante
importante para las empresas que manejan una gran cantidad de datos
confidenciales, que no deberían ser conocidos por todos.

Sentinel - DNS descentralizado y red de entrega de contenido (dDNS y dCDN)
---

El Sentinel dDNS trabaja para eliminar la resolución centralizada de la ubicación física de
un nombre de dominio para descentralizar la búsqueda de dominio. Sentinel pretende
tener nodos como nodos de puerta de enlace y usar DHT (tablas hash distribuidas) en
múltiples nodos para hacer esto.

Al usar esto, habrá DHT con ubicaciones de nodos donde se almacenan los medios y
datos. Cada uno de estos nodos es descubierto por el usuario / solicitante y, en función
de la latencia y la infraestructura de entrega, el contenido se entrega desde la ubicación más óptima.

Usando tanto dDNS como dCDN, la red en general está descentralizada, desde la
búsqueda hasta la resolución y la entrega.


Computación en la nube descentralizada (dCompute)
---

Sentinel trabaja para habilitar aplicaciones con sus API y, eventualmente, el Kit de
desarrollo de software (SDK), que se pueden integrar en sus aplicaciones. De esta forma,
los desarrolladores pueden usar la infraestructura existente de Sentinel Network y
comenzar a utilizar no solo el ancho de banda, sino también el almacenamiento y la
informática como parte de esta red.

Por ejemplo, supongamos que DocStore es una aplicación de almacenamiento de
documentos que usa Sentinel para almacenar datos y documentos. Los usuarios de
DocStore pueden usar la infraestructura en la nube tradicional como AWS o S3 para ser
específicos o pueden usar la infraestructura descentralizada de almacenamiento y red
proporcionada por Sentinel.

En el futuro, la red de Sentinel también proporcionará la capacidad de las aplicaciones
para ejecutar modelos sobre estos datos. Con base en los recursos de computación
disponibles, el hardware que está optimizado para algoritmos de Machine Learning (ML)
o algoritmos de Deep Learning (DL) para ejecutarse, se identificará automáticamente y
se combinará con el requerimiento.

Finalización de Sentinel 'TestDrop'
---

Sentinel ha llevado a cabo un exitoso 'TestDrop' en el que más de 900 probaron el VPP
MVP de Sentinel y proporcionaron comentarios a través de nuestro bot en Telegram - @SentinelSupportBot

Los servidores agotaron al máximo la carga y alcanzaron un máximo de 75 sesiones
simultáneas durante un tiempo de 72-96 horas. Con los comentarios de la comunidad,
el equipo de desarrollo de Sentinel ha trabajado en estos comentarios y ha lanzado una
versión (v0.0.32) durante el TestDrop y además planificado solucionar otros problemas
encontrados durante el proceso.

Sentinel es uno de los pocos tokens estándar ERC20 que utiliza la cadena Ethereum para
la entrada y validación de datos no fungibles. En este caso, Sentinel lo ha utilizado para
la validación de los datos transmitidos entre el proveedor del servicio (nodo de salida) y
el usuario.

La responsabilidad de consenso requerida para validar los datos en el punto de medición
se otorga al sistema de nodo principal 'Pasarela de pago de servicios'.

El camino que queda por delante
===

Enfoque inmediato
---

- dVPN v0.0.4 con intercambios centralizados ERC20 en cadena (ERC20 a $ SENT)
- Prototipo Sentrix
- Aumentar las capacidades de los nodos para conectarse a la red TOR de la capa 2
- Desarrollo de red de nodos
- Un sitio web “One Pager” para ser actualizado
- Libro blanco para ser lanzado

Integración con TenderMint y Cosmos
---

Según lo declarado por el equipo de Cosmos, "Tendermint es un software para replicar
de manera segura y consistente una aplicación en muchas máquinas. Para poner
simplemente Tendermint es un software que se puede utilizar para lograr la tolerancia
de fallas bizantina (BFT) en cualquier plataforma de computación distribuida ".

Manteniendo lo anterior y una serie de otros factores como Cosmos Swap Zones, la
interoperatividad con Cosmos Hubs, etc. en perspectiva, el equipo de Sentinel ha elegido
TenderMint para implementar la primera versión (alfa) de la cadena de servicio Sentinel
y continúa investigando y contribuyendo de vuelta a la comunidad.

Equipo de desarrollo de Sentinel
---

El único objetivo del equipo es producir como mínimo 300 horas de trabajo de desarrollo
por semana como mínimo y este número solo aumentará. Sigue mirando el GitHub y
mira a los nuevos contribuyentes. Sentinel, para acelerar el progreso, estará
representado en un evento público de renombre a principios de mayo.

El equipo de desarrollo de Sentinel consiste en un fuerte equipo de desarrollo de
marketing, front-end y back-end. Sentinel no contrata ningún desarrollador de back-end
remoto y actualmente todos los desarrolladores están trabajando a tiempo completo
en el proyecto.

El equipo cuenta con más de 25 personas que componen desarrolladores de stack
completo, arquitectos de sistemas, ingenieros de UI / UX, ingenieros de hardware,
asesoramiento legal, etc. Ya hay más de 500 confirmaciones del código Sentinel en un
trimestre. Esto coloca a Sentinel entre los 25 mejores proyectos comprometidos con
GitHub.
