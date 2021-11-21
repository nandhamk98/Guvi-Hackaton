//prep
const data = document.querySelector('#data');
const navigation = document.querySelector('#navigation');
const baseUrl = 'http://makeup-api.herokuapp.com/api/v1/products.json';
let itembaseUrl = 'http://makeup-api.herokuapp.com/api/v1/products';

const navList = document.createElement('ul');
const homeNav = document.createElement('li');
homeNav.innerHTML = `Home`
homeNav.setAttribute('id','home');


let back ='';
const productTypes = {
    'Blush': 'blush',
    'Bronzer': 'bronzer',
    'Eyebrow': 'eyebrow',
    'Eyeliner': 'eyeliner',
    'Eyeshadow': 'eyeshadow',
    'Foundation': 'foundation',
    'Lip liner' : 'lip_liner',
    'Lipstick': 'lipstick',
    'Mascara': 'mascara',
    'Nail polish':'nail_polish'
}

const productCategories = { 
    'Powder': 'powder',
    'Cream': 'cream',
    'Pencil': 'pencil',
    'Liquid': 'liquid',
    'Gel': 'gel',
    'Palette': 'palette',
    'Concealer': 'concealer',
    'Contour': 'contour',
    'Bb cc': 'bb_cc',
    'Mineral': 'mineral',
    'Highlighter': 'highlighter',
    'Lip gloss': 'lip_gloss',
    'Lip stain': 'lip_stain'
};



//Adding Home nav to the page
const addHomeNav = ()=>{
    navList.appendChild(homeNav);
    navigation.innerHTML = '';
    navigation.appendChild(navList);
}

//Adding Home nav and product  to the page
const addProductNav = product =>{
    navList.appendChild(homeNav);
    navigation.innerHTML = '';
    navigation.appendChild(navList);
    let productsPage = document.createElement('li');
    let type = back === 'product_category' ? 'category' : back;
    let name = product[type].split('_').map(el=> el[0].toUpperCase()+el.slice(1)).join(' ');
    productsPage.innerHTML = name;
    productsPage.setAttribute('id',product[type]);
    navList.appendChild(productsPage);
    return productsPage;
}




// const imageapi = async (ProductData)=>{
//     let data = [];
//     for(let index = 0 ; index < ProductData.length ; index++){
//         let product = ProductData[index];
//         let flag = 0;
//         try{
//             let response = await fetch(product.image_link).catch(e=>{
//                 console.error('err');
//                 flag =1 ;
//             });
//             if(response.status !== 200){
//                 console.log(response);
//                 console.log('inner error');
//                 flag =1 ;}
//             }
//             catch(e){
//                 console.log('error');
//             }
//             if(flag)continue;
//             data.push(product)
//         }
//         console.log(data);
//     return data;
// }


//Creating colour circle in product page
const getColor = (colours) =>{
    let content = '';
    for(let index = 0 ; index < colours.length ; index++){
        content += `<div class='ColourArea'><div class='colourCircle' id='color-${colours[index].hex_value.split(',')[0].slice(1)}' style="background: ${colours[index].hex_value.split(',')[0]}"></div>
        <p>${colours[index].colour_name}</p></div>
        `
    }
    // console.log(content);
    return content;
}


//Display contents on the product page
displayProductItemContent = (product) => {
    let  productsPage = addProductNav(product);
    let content = `<h2 class="text-center">${product.name}</h2>
    <div class='row'>
    <div class="col-12">
        <div id=${product.id} class = 'productItems '>
            <div class ='text-center'>
                <div class='container imageArea' >
                    <img src='${product.api_featured_image}' alt='${product.id}' height='150' width='150'/>
                </div>
            </div>
            <div class='container'>
                <h5><b>Brand:${product.brand.split(' ').map(el=> el[0].toUpperCase()+el.slice(1)).join(' ')}</b></h5>
                <h5><b>Price:${product.price_sign}${product.price}</b></h5>
                <h5><b>Star Rating:${product.rating === null ? 'Unrated': product.rating }</b></h5></div>
                <hr>
                <div class="container ColourArea">${getColor(product.product_colors)}</div>
                <hr>
                <p><b>Description:</b></p>${product.description}</p>
                <div class="container mb-5">
                    <div class="text-center buy">
                     
                        <a href='${product.product_link}'  >Buy</a>
                    </div>
                </div>
            </div>  
        </div>
    </div>
    </div>
    `
    data.innerHTML = content;

    productsPage.addEventListener('click', () => {
        if(back === 'product_type'){
            fetchProductAPi(product[back])
        }else if(back === 'product_category'){
            fetchProductCategoryAPi(product['category']);
        }
    })
    document.querySelector('#home').addEventListener('click',loadContent);

}

//Fetching single product details using api
const fetchProductItemyAPi = async (id)=>{
    let url = itembaseUrl+`/${id}.json`;
    // console.log(url);
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    // data = await imageapi(data);
    await displayProductItemContent(data);
}

//Replaceing null values with default values
const setDefaultValue = (value,DefaultValue)=>{
    let content = (value === null) || (value === undefined) || (value === '') ? DefaultValue : value;
    return content[0].toUpperCase()+content.slice(1);
}

//Displaying products to the product list page
const displayProductContent = (ProductData,title) =>{
    let content = `<h2 class="text-center">${title[0].toUpperCase()+title.slice(1)}</h2><div class='row'>`;
    for(let index = 0 ; index < ProductData.length ; index++){
        let product = ProductData[index];
        content += `<div class="col-md-4 col-sm-6">
        <div id=${product.id} class = 'p-4 m-2 productCards productItems'>
            <div class='container image' >
                <img src='${product.api_featured_image}' alt='${product.id}' height='122' width='122'/>
            </div>
            <div class='container'>
                <p class='text-center mt-4'><b>${setDefaultValue(product.brand,'unknown')}</b></p>
            </div>
            
            <div class='container'>
                <p class='text-center'><b>${product.name}</b></p>
            </div>
            
            <div class='container'>
                <p class='text-center'><b>Category:</b>${setDefaultValue(product.category,'unknown')}</p>
            </div>
            <div class='container'>
                <p class='text-center'><b>Price:</b>${product.price_sign === null ? '$' : product.price_sign}${product.price === null ? '???' : product.price}</p>
            </div>
        </div>
    </div>`;
    }
    // console.log('over');
    data.innerHTML = content + `</div>`;

    document.querySelector('#home').addEventListener('click',loadContent);

    let productItems = document.querySelectorAll('.productItems');
    // console.log(productItems);
    for(let index = 0 ; index < productItems.length;index++){
        let product = productItems[index];
        // console.log(product.id);
        // console.log(product);
        product.addEventListener('click',()=>{
            fetchProductItemyAPi(product.id);
        })
    }
}

//Removing nav items from the navigation bar when we go back
const navigationRemoveChild = () =>{
    let navigationHeader = document.querySelectorAll('#navigation>ul>li');
    // console.log(navigationHeader);
    if(navigationHeader.length >1){
        navList.removeChild(navList.lastChild);
        // console.log('removedChild')
    }
}

//Fetch products using product api
const fetchProductAPi = async (product)=>{
    navigationRemoveChild();
    addHomeNav()
    back = 'product_type'
    let url = baseUrl+`?product_type=${product}`;
    // console.log(url);
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    // data = await imageapi(data);
    await displayProductContent(data, product);
}

//fetch products using product category api
const fetchProductCategoryAPi = async (product)=>{
    navigationRemoveChild();
    addHomeNav()
    back = 'product_category'
    let url = baseUrl+`?product_category=${product}`;
    // console.log(url);
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    // data = await imageapi(data);
    await displayProductContent(data,product);
}


//lists different products
const loadProductypes = () =>{
    let divContainer = document.createElement('div');
    divContainer.setAttribute('id', 'productTypesData');
    divContainer.setAttribute('class', 'container');
    let productData = `<h2 class='text-center my-3'>Products</h2><div class='row'>`;
    for(let product in productTypes){
        productData += `<div class="col-md-4 col-sm-6">
            <div id=${productTypes[product]} class = 'p-4 m-2 itemCard products'>
            <h3 class='text-center'>${product}</h3>
            </div>
        </div>`;
    }
    data.innerHTML += productData + `</div>`;
}

//Lists different product category
const loadProductCategory = () => {
    let divContainer = document.createElement('div');
    divContainer.setAttribute('id', 'productCategoryData');
    divContainer.setAttribute('class', 'container');
    let productCategoryData = `<h2 class="text-center my-3">Product Categories</h2><div class='row'>`;
    for(let product in productCategories){
        productCategoryData += `<div class="col-md-4 col-sm-6">
            <div id=${productCategories[product]} class = 'p-4 m-2 itemCard categories'>
            <h3 class='text-center'>${product}</h3>
            </div>
        </div>`;
    }
    data.innerHTML += productCategoryData + `</div>`;
}

//Load image content in home page
const loadImageContents = () =>{
    let content = `<div class="container">
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100 h-50" src="https://static.onecms.io/wp-content/uploads/sites/23/2021/06/15/how-to-transition-into-beauty-routine-2000.jpg" alt="First slide">
          </div>
          <div class="carousel-item">
            <img class="d-block w-100 h-50" src="https://previews.123rf.com/images/denisfilm/denisfilm1803/denisfilm180301450/97999948-make-up-and-cosmetic-beauty-products-set-of-cosmetics-and-make-up-equipment-top-view-.jpg" alt="Second slide">
          </div>
          <div class="carousel-item">
            <img class="d-block w-100 h-50" src="https://st2.depositphotos.com/1765488/7039/i/950/depositphotos_70392635-stock-photo-frame-with-various-makeup-products.jpg" alt="Third slide">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
</div>`

    data.innerHTML = content;
}

//loads image contents in second page
const loadImageContents1 = () =>{
    let content = `<div class="container my-4">
    <div id="carouselExampleIndicators1" class="carousel slide" data-ride="carousel1">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators1" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators1" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators1" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100 h-50" src="https://img.ti-media.net/wp/uploads/sites/46/2021/08/GettyImages-1298389311.jpg" alt="First slide">
          </div>
          <div class="carousel-item">
            <img class="d-block w-100 h-50" src="https://img.ti-media.net/wp/uploads/sites/46/2021/06/GettyImages-1249466095-1.jpg" alt="Second slide">
          </div>
          <div class="carousel-item">
            <img class="d-block w-100 h-50" src="https://www.theladders.com/wp-content/uploads/makeup-191119.jpg" alt="Third slide">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators1" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators1" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
</div>`

    data.innerHTML += content;
}

//Loads all contents in home page
const loadContent =  ()=>{
    navigationRemoveChild();
    navigation.innerHTML =`<p class="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellat sequi, soluta ad inventore nobis! Facilis possimus voluptate saepe quasi, a eos cumque. Porro voluptatem perferendis magni, reiciendis error id.</p>`;
    loadImageContents();
    loadProductypes();
    loadImageContents1();
    loadProductCategory();

    let productsCards = data.querySelectorAll('.products');
    // console.log(productsCards);
    for(let index = 0 ; index < productsCards.length;index++){
        let product = productsCards[index];
        // console.log(product.id);
        product.addEventListener('click',()=>{
            fetchProductAPi(product.id)
        })
    }

    let productsCategoryCards = data.querySelectorAll('.categories')
    // console.log(productsCategoryCards);
    for(let index = 0 ; index < productsCategoryCards.length;index++){
        let product = productsCategoryCards[index];
        // console.log(product.id);
        product.addEventListener('click',()=>{
            fetchProductCategoryAPi(product.id);
        })
    }
}



document.addEventListener('DOMContentLoaded',loadContent);

// document.querySelector('#home').addEventListener('click',loadContent);

