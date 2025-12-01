import type { FormEvent } from "react";
import s from "./styles/LoginPage.module.css";

export default function LoginPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className={s.page}>
      <div className={s.shell}>
        <div className={s.brandPanel}>
          <div className={s.badge}>Laundrify</div>
          <h1 className={s.title}>Bienvenido de nuevo</h1>
          <p className={s.subtitle}>
            Gestiona tus pedidos, agenda recogidas y mantén tus clientes felices
            desde una sola vista. Conéctate para continuar.
          </p>
          <div className={s.highlights}>
            <div>
              <span className={s.dot} aria-hidden="true" />
              <span>Autenticación segura</span>
            </div>
            <div>
              <span className={s.dot} aria-hidden="true" />
              <span>Monitoreo en tiempo real</span>
            </div>
            <div>
              <span className={s.dot} aria-hidden="true" />
              <span>Optimizado para móvil</span>
            </div>
          </div>
        </div>

        <div className={s.formCard}>
          <header className={s.formHeader}>
            <p className={s.kicker}>Panel de control</p>
            <h2 className={s.formTitle}>Inicia sesión</h2>
            <p className={s.formSubtitle}>
              Usa tus credenciales corporativas para acceder a la plataforma.
            </p>
          </header>

          <form className={s.form} onSubmit={handleSubmit}>
            <label className={s.label} htmlFor="email">
              Correo electrónico
              <input
                id="email"
                name="email"
                type="email"
                required
                className={s.input}
                autoComplete="email"
                placeholder="tuequipo@laundrify.com"
              />
            </label>

            <label className={s.label} htmlFor="password">
              Contraseña
              <input
                id="password"
                name="password"
                type="password"
                required
                className={s.input}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </label>

            <div className={s.optionsRow}>
              <label className={s.checkboxLabel}>
                <input type="checkbox" name="remember" className={s.checkbox} />
                <span>Mantener sesión activa</span>
              </label>
              <a className={s.link} href="#recuperar">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className={s.primaryButton}>
              Acceder
            </button>

            <div className={s.metaInfo}>
              <span className={s.separator} />
              <div className={s.metaCopy}>
                Soporte 24/7 y autenticación multi-factor disponible.
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
