
const Nav = ({ page = 1, setPage, pageh }) => {
  const handlePageClick = () => {
    const inp = prompt('Jump to page', page)
    // setPage(Number(inp))
    window.scrollTo({ top: (Number(inp) - 1) * pageh })
  }
  return (
    <nav>
      <div className="page-contain">
        <div className="surah caption">الفتحة</div>
        <div className="page" onClick={handlePageClick}>{ConvertToArabicNumbers(page)}</div>
        <div className="juz caption">الجزء ١</div>
      </div>
    </nav>
  )
}

const ConvertToArabicNumbers = (num) => {
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
 return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
}

export default Nav
