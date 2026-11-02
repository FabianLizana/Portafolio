## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Dev server lifecycle

Para evitar dejar procesos colgados y puertos enredados, seguir SIEMPRE este flujo:

1. Levantar el server con `npx astro dev --host` cuando se necesite verificar algo.
2. Después de cada verificación, cerrarlo con `npx astro dev stop`.
3. Las conexiones en `TimeWait` que queden en el puerto 4321 son inofensivas (el SO las libera en ~30s) — no ocupan el puerto.
4. Si `astro dev stop` no funciona, matar el proceso por PID:
   ```powershell
   Get-NetTCPConnection -LocalPort 4321 | Select-Object OwningProcess
   Stop-Process -Id <pid>
   ```
5. NUNCA dejar el server corriendo al terminar una tarea.
