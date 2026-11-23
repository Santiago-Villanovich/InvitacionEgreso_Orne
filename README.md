# Invitación fiesta de egreso

Sitio estático (GitHub Pages) + Google Sheets como base de datos.

| Archivo | Para qué |
|---|---|
| `index.html` | La invitación. Cada familia entra con su link: `?inv=slug` |
| `status/index.html` | Panel: confirmaciones, invitados y compras |
| `config.js` | **Lo único que tenés que editar**: textos, horarios por grupo, timeline, figuritas, fotos y URL del backend |
| `apps-script/Code.gs` | Backend que va pegado dentro de la planilla de Google |
| `img/` | Tus fotos (crear la carpeta) |

Sin `SCRIPT_URL` en `config.js` todo funciona en **modo demo**: los datos quedan en tu navegador y los invitados salen de `MOCK_INVITADOS`.

---

## 0. Levantarlo en tu compu (VS Code)

1. **Archivo → Abrir carpeta** → `invitacion-egreso`.
2. **Terminal → Nueva terminal** y ejecutar:
   ```powershell
   python -m http.server 8080
   ```
3. Abrir en el navegador:
   - Invitación: http://localhost:8080/?inv=familia-perez
   - Panel: http://localhost:8080/status/
4. Después de guardar un cambio, refrescar la página con F5. Para cortar el servidor: `Ctrl+C` en la terminal.

> Si `python` no se encuentra, cerrá y volvé a abrir VS Code (la terminal toma el PATH al abrirse).
> Para volver a ver el sobre cerrado: en el panel tocá "Reiniciar demo", o abrí la página en una ventana de incógnito.

---

## 1. Configurar la invitación (`config.js`)

- **`evento`**: nombre, carrera, fecha, lugar, dirección, `mapsQuery` (lo que buscarías en Google Maps), dress code, fecha límite y el texto de bebidas.
- **Horario general**: `inicio`, `duracionHoras` y `horaTexto` de `evento` los ven las familias que no tienen grupo. Los horarios por grupo se manejan desde `/status → Grupos y horarios` (ver punto 3).
- **`timeline`**: etapas de la historia. Para la foto: guardala en `img/` y poné `foto: 'img/salita.jpg'`.
- **`figuritas`**: el orden del sobre. `tipo: 'foto'` lleva foto y título; `tipo: 'dato'` muestra un dato del evento (`fecha`, `lugar`, `dress`, `bebida`, `confirmar`). `brillante: true` le da efecto holográfico. Conviene que sea un número par.
- **Fotos**: achicalas antes de subirlas (unos 1200 px del lado largo, JPG) para que cargue rápido en el celular.

> El repo va a ser **público**: no pongas nombres reales en `MOCK_INVITADOS`. Los invitados reales van en la planilla, que es privada.

---

## 2. Conectar con Google Sheets

### 2.1 Crear la planilla y el script
1. Entrar a https://sheets.new y ponerle un nombre (ej. "Fiesta egreso").
2. Menú **Extensiones → Apps Script**. Se abre el editor.
3. Borrar todo el contenido de `Código.gs`, pegar el contenido completo de `apps-script/Code.gs` y guardar (ícono de disquete o `Ctrl+S`).

### 2.2 Crear las hojas
1. En la barra de arriba del editor, elegir la función **`setup`** en el desplegable y tocar **Ejecutar**.
2. Google pide permisos: **Revisar permisos** → elegir tu cuenta → aparece "Google no verificó esta app" → **Configuración avanzada** → **Ir a (nombre del proyecto)** → **Permitir**. Es normal, porque el script es tuyo.
3. Volver a la planilla: ahora tiene las hojas `Invitados`, `Respuestas` y `Compras`.

### 2.3 Clave del panel
1. En el editor de Apps Script: ⚙️ **Configuración del proyecto** (menú izquierdo).
2. Abajo, **Propiedades de la secuencia de comandos → Agregar propiedad**:
   - Propiedad: `STATUS_KEY`
   - Valor: la clave que vas a usar para entrar a `/status`
3. **Guardar**.

### 2.4 Publicar el script
1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En "Seleccionar tipo" (⚙️): **Aplicación web**.
3. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
4. **Implementar** y copiar la **URL de la aplicación web** (termina en `/exec`).
5. Probarla: pegá en el navegador `TU_URL?action=invite&inv=prueba`. Tiene que responder `{"ok":false,"error":"not_found"}`, lo que significa que funciona.

### 2.5 Conectar la página
En `config.js`:
```js
SCRIPT_URL: 'https://script.google.com/macros/s/XXXX/exec',
```
Refrescar http://localhost:8080/status/: ahora pide la clave y lee la planilla.

### 2.6 Si cambiás `Code.gs` más adelante
**Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión → Implementar**. La URL no cambia. Si no hacés esto, sigue corriendo la versión anterior.

---

## 3. Cargar grupos e invitados (desde `/status`)

1. **Grupos y horarios** → "+ Agregar grupo": nombre (ej. `familia`), el texto que ve el invitado (ej. `de 20 a 24 hs`), y cuándo empieza y termina (para la cuenta regresiva y el calendario). Se guarda solo.
2. **Invitados** → "+ Nueva familia": nombre que aparece en la invitación, integrantes (uno por renglón) y grupo. El link se genera solo, con un sufijo difícil de adivinar (`familia-perez-7k2`).
3. Con ✏️ editás y con 🗑️ borrás. El link de una familia no cambia al editarla.
4. "Copiar" o "WhatsApp" para mandar cada link.

Todo queda en las hojas `Grupos` e `Invitados` de la planilla; también se pueden editar ahí a mano.

---

## 4. Publicar en GitHub Pages

### 4.1 Crear el repositorio
1. https://github.com/new → nombre: `invitacion` → **Public** → **Create repository** (sin README).

### 4.2 Subir los archivos (desde la terminal de VS Code)
Si ya habías agregado un `origin` con otra URL, corregilo con `git remote set-url origin URL_NUEVA` en lugar de `git remote add`.
```powershell
git init
git add .
git commit -m "Invitación de egreso"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/invitacion.git
git push -u origin main
```
La primera vez te va a pedir que inicies sesión en GitHub. Alternativa sin terminal: en la página del repo, **Add file → Upload files** y arrastrar el contenido de la carpeta.

### 4.3 Activar Pages
1. En el repo: **Settings → Pages**.
2. Source: **Deploy from a branch** → Branch: **main**, carpeta **/ (root)** → **Save**.
3. En 1 o 2 minutos queda en:
   - Invitación: `https://TU_USUARIO.github.io/invitacion/?inv=perez-7k2`
   - Panel: `https://TU_USUARIO.github.io/invitacion/status/`

### 4.4 Actualizar después
Cada cambio:
```powershell
git add .
git commit -m "Actualizo fotos"
git push
```
GitHub Pages se actualiza solo en un par de minutos. Si no ves el cambio, refrescá con `Ctrl+F5`.
