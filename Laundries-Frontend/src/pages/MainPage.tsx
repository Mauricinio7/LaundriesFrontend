import s from "./styles/MainPage.module.css";

export default function MainPage() {
  return (
    <section>
      <h1 className="sr-only">Esta es la página 1</h1>
      <div className={s.grid}></div>
    </section>
  );
}
