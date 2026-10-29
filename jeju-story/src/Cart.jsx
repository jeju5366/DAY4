export default function Cart({ cart, onBack }) {
  const { items, count, error, setQty, remove, clear } = cart;

  return (
    <main className="cart">
      <h2>🛒 장바구니 <small>({count}개)</small></h2>
      {error && <p className="msg err">{error}</p>}

      {items.length === 0 ? (
        <p className="note">장바구니가 비어 있어요. 갤러리에서 마음에 드는 사진을 담아 보세요!</p>
      ) : (
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.id}>
              <img src={i.thumb_url} alt={i.title} />
              <div className="info">
                <strong>{i.title || "제주 사진"}</strong>
                <a href={i.page_url} target="_blank" rel="noreferrer">📷 {i.photographer}</a>
              </div>
              <div className="qty">
                <button className="tab" onClick={() => setQty(i.id, i.quantity - 1)} aria-label="수량 줄이기">−</button>
                <span>{i.quantity}</span>
                <button className="tab" onClick={() => setQty(i.id, i.quantity + 1)} aria-label="수량 늘리기">+</button>
              </div>
              <button className="btn ghost" onClick={() => remove(i.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-actions">
        <button className="btn ghost" onClick={onBack}>← 계속 둘러보기</button>
        {items.length > 0 && <button className="btn" onClick={clear}>전체 비우기</button>}
      </div>
    </main>
  );
}
