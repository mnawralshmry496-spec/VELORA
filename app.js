// بيانات المنتجات تجريبية. استبدلها بمنتجات VELORA الحقيقية قبل الإطلاق.
const products = [
  {id:1,name:"تيشيرت VELORA 01",category:"shirts",categoryName:"تيشيرتات",description:"تيشيرت من المجموعة الأولى. أضف وصف القماش والقصة والتفاصيل بعد اعتماد المنتج النهائي.",price:15000,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",tag:"NEW",sizes:["S","M","L","XL"],colors:["أبيض","أسود"]},
  {id:2,name:"تيشيرت VELORA 02",category:"shirts",categoryName:"تيشيرتات",description:"قطعة بتصميم بسيط من مجموعة VELORA الأولى. الصور الحالية للعرض التجريبي فقط.",price:15000,image:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",tag:"LIMITED",sizes:["S","M","L","XL"],colors:["أبيض","أسود"]},
  {id:3,name:"تيشيرت VELORA 03",category:"shirts",categoryName:"تيشيرتات",description:"أضف هنا تفاصيل الخامة والقياس والعناية بالقطعة بعد تثبيت مواصفاتها.",price:15000,image:"https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85",tag:"NEW",sizes:["S","M","L","XL"],colors:["أبيض","أسود"]},
  {id:4,name:"عطر VELORA 01",category:"perfumes",categoryName:"عطور",description:"عطر من مجموعة VELORA. أضف الحجم والنفحات العطرية ومدة الثبات بعد اعتماد المنتج.",price:25000,image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",tag:"NEW",sizes:["30 مل","50 مل","100 مل"],colors:["حسب التوفر"]},
  {id:5,name:"عطر VELORA 02",category:"perfumes",categoryName:"عطور",description:"أضف وصف الرائحة والمكونات والحجم عند تجهيز بيانات المنتج الحقيقية.",price:25000,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",tag:"NEW",sizes:["30 مل","50 مل","100 مل"],colors:["حسب التوفر"]}
];

// غيّر الرقم إلى رقم واتسابك بصيغة دولية من دون + أو مسافات.
const WHATSAPP_NUMBER = "9647XXXXXXXXX";
const CURRENCY = "د.ع";
const formatPrice = (amount) => new Intl.NumberFormat("en-US").format(amount) + " " + CURRENCY;
let cart = JSON.parse(localStorage.getItem("velora-cart") || "[]").map((item,index)=>({
  ...item,
  cartId: item.cartId || `legacy-${item.id}-${index}-${item.key || "item"}`
}));
const $ = (id) => document.getElementById(id);
let activeCategory = "all";

function renderProducts(){
  const shown = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);
  $("productGrid").innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image" onclick="openProduct(${p.id})">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
        <button class="quick-add" onclick="event.stopPropagation();openProduct(${p.id})">اختر القياس ＋</button>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.categoryName}</p></div><span class="product-price">${formatPrice(p.price)}</span></div>
    </article>`).join("");
}
$("categoryFilters").querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $("categoryFilters").querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
    renderProducts();
  });
});

function openProduct(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  $("productModalBody").innerHTML = `
    <div class="product-detail">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-detail-copy">
        <p class="eyebrow">${p.categoryName}</p><h3>${p.name}</h3>
        <div class="detail-price">${formatPrice(p.price)}</div>
        <p>${p.description}</p>
        <label>اختر المقاس / الحجم
          <select id="detailSize">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
        </label>
        <label>اللون
          <select id="detailColor">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select>
        </label>
        <button class="button button-dark full-button" onclick="addDetailToCart(${p.id})">أضف إلى السلة</button>
      </div>
    </div>`;
  $("productModal").classList.add("active");
}
function addDetailToCart(id){
  const size = $("detailSize").value;
  const color = $("detailColor").value;
  const key = `${id}-${size}-${color}`;
  const found = cart.find(item => item.key === key);
  if(found) found.qty++;
  else cart.push({id,qty:1,size,color,key,cartId:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`});
  saveCart();
  $("productModal").classList.remove("active");
  openCart();
}
$("productModalClose").addEventListener("click",()=>$("productModal").classList.remove("active"));

function saveCart(){localStorage.setItem("velora-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const size=p.sizes[0], color=p.colors[0], key=`${id}-${size}-${color}`;
  const found=cart.find(item=>item.key===key);
  if(found) found.qty++; else cart.push({id,qty:1,size,color,key,cartId:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`});
  saveCart();openCart();
}
function renderCart(){
  $("cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
  $("cartItems").innerHTML=cart.length?cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${item.size || "غير محدد"} · ${item.color || "غير محدد"}</p><p>${formatPrice(p.price)} للقطعة</p><p><button class="remove-item" onclick="removeItem('${item.cartId}')">حذف المنتج</button></p></div><div><button class="remove-item" onclick="changeQty('${item.cartId}',1)">＋</button><br><span>${item.qty}</span><br><button class="remove-item" onclick="changeQty('${item.cartId}',-1)">−</button></div></div>`;
  }).join(""):`<div class="empty-cart">سلتك فارغة حالياً.</div>`;
  const total = cart.reduce((sum,item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  $("cartTotal").textContent=cart.length?formatPrice(total):"—";
}
function changeQty(cartId,delta){
  const item=cart.find(x=>x.cartId===cartId);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.cartId!==cartId);
  saveCart();
}
function removeItem(cartId){
  cart=cart.filter(x=>x.cartId!==cartId);
  saveCart();
}
function openCart(){$("overlay").classList.add("active");$("cartDrawer").classList.add("active");}
function closeCart(){$("overlay").classList.remove("active");$("cartDrawer").classList.remove("active");}
$("cartOpen").addEventListener("click",openCart);
$("cartClose").addEventListener("click",closeCart);
$("overlay").addEventListener("click",closeCart);
$("checkoutOpen").addEventListener("click",()=>{
  if(!cart.length){alert("أضف منتجاً إلى السلة أولاً.");return;}
  closeCart();$("checkoutModal").classList.add("active");$("orderResult").hidden=true;$("checkoutForm").hidden=false;
});
$("checkoutClose").addEventListener("click",()=>$("checkoutModal").classList.remove("active"));
$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const lines=cart.map((item,index)=>{
    const p=products.find(x=>x.id===item.id);
    const size=item.size || "غير محدد";
    const color=item.color || (p && p.colors && p.colors[0]) || "غير محدد";
    return `${index+1}) ${p ? p.name : "منتج"}\n   المقاس/الحجم: ${size}\n   اللون: ${color}\n   الكمية: ${item.qty}`;
  }).join("\n\n");
  const total = cart.reduce((sum,item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const priceLines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `• ${p ? p.name : "منتج"} — ${formatPrice(p ? p.price * item.qty : 0)}`;
  }).join("\n");
  const message =
`*طلب جديد — VELORA*
━━━━━━━━━━━━━━━━━━
*بيانات الزبون*
الاسم: ${data.get("name")}
الهاتف: ${data.get("phone")}
المنطقة: ${data.get("area")}
العنوان: ${data.get("address")}

*المنتجات*
${lines}

*تفاصيل الأسعار*
${priceLines}

━━━━━━━━━━━━━━━━━━
*الإجمالي: ${formatPrice(total)}*
التوصيل: يُحدد عند التأكيد
شكراً لاختياركم VELORA.`;
  $("orderText").value=message;$("checkoutForm").hidden=true;$("orderResult").hidden=false;
});
$("copyOrder").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("orderText").value);$("copyOrder").textContent="تم النسخ";}catch(e){$("orderText").select();document.execCommand("copy");$("copyOrder").textContent="تم النسخ";}
});
$("sendWhatsApp").addEventListener("click",()=>{
  if(WHATSAPP_NUMBER.includes("X")){
    alert("قبل الاستخدام، افتح app.js واستبدل WHATSAPP_NUMBER برقم واتسابك بصيغة دولية، مثال: 9647XXXXXXXXX");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent($("orderText").value)}`;
  window.open(url,"_blank","noopener,noreferrer");
});
$("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
