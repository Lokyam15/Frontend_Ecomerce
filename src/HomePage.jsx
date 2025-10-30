import './HomePage.css'

export default function App() {
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon menu" aria-label="menu">☰</button>
          <div className="logo">Shopping</div>
        </div>
        <div className="topbar-center">
          <input className="search" placeholder="Buscar productos..." aria-label="buscar" />
          {/*<button className="filter-btn">Filtros</button>*/}
        </div>
        <div className="topbar-right">
          <button className="icon" aria-label="iniciar sesión">👤</button>
          <button className="icon" aria-label="carrito">🛒</button>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <h3>Filtros</h3>
          <div className="filter-group">
            <label>Talla</label>
            <select>
              <option>Todas</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Color</label>
            <div className="color-list">
              <button className="color-swatch" style={{background:'#000'}} aria-label="negro"></button>
              <button className="color-swatch" style={{background:'#fff'}} aria-label="blanco"></button>
              <button className="color-swatch" style={{background:'#f00'}} aria-label="rojo"></button>
              <button className="color-swatch" style={{background:'#00f'}} aria-label="azul"></button>
            </div>
          </div>
          <div className="filter-group">
            <label>Tipo</label>
            <ul>
              <li><input type="checkbox" /> Camisetas</li>
              <li><input type="checkbox" /> Pantalones</li>
              <li><input type="checkbox" /> Chaquetas</li>
            </ul>
          </div>
        </aside>

        <section className="product-area">
          <div className="product-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <article className="product-card" key={i}>
                <div className="thumb" />
                <h4>Modelo {i + 1}</h4>
                <p className="price">$ {Math.floor(20 + Math.random() * 80)}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
