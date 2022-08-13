/*Waiting for a page load and starts to create main html elements of the page, using specific functions.
 Two event handlers starts after that.*/
$(function () {
    /*This function creates page "header", a block with page Name and control buttons ('ADD', 'MASS DELETE'). */
    createHeader();
    /*This function loads products from database.*/
    connectToDatabase();
    /*Event handler for a 'ADD' button. After the button was pressed, redirect to a page in the location field. */
    $('#next-page-btn').on('click', function () {
        window.location.href = 'product_add.html';
    });
    $('#delete-product-btn').on('click', function () {
        massDelete();
    });
});

/*Function for creating page "header". Contains div elements to combine html elements (label, input, hr) for css stylization.*/
function createHeader() {
    let headerContainer = $('<div>', {id: 'header-container', class: 'page-blocks-alignment header'}).appendTo('body');
    $('<label>', {text: 'Product List', class: 'form-name'}).appendTo(headerContainer);
    let buttonsContainer = $('<div>', {class: 'form-list-menu'}).appendTo(headerContainer);
    $('<input>', {type: 'button', id: 'next-page-btn', val: 'ADD', class: 'page-buttons'}).appendTo(buttonsContainer);
    $('<input>', {type: 'button', id: 'delete-product-btn', val: 'MASS DELETE', class: 'page-buttons'}).appendTo(buttonsContainer);
    $('<hr>', {class: 'page-blocks-alignment'}).appendTo('body');
}
/*Function for creating page "footer". Contains div elements to combine html elements for css stylization.*/
function createFooter() {
    let footer = $('<footer>');
    footer.appendTo('body');
    $('<hr>', {class: 'page-blocks-alignment'}).appendTo(footer);
    let footerContainer = $('<div>', {class: 'page-blocks-alignment footer-text'});
    footerContainer.appendTo(footer);
    $('<label>', {text: 'Scandiweb Test assignment'}).appendTo(footerContainer);
}
/*This function makes Ajax POST request to gain data from database. When data received, ir starts makeGrid() function.*/
function connectToDatabase() {
    let product = [];
    product.push('load');
    $.ajax(
        {
            type: 'POST',
            url: 'php/Resolver.php',
            dataType: 'json',
            data: {product},
            success: function (products) {
                if (products) {
                    makeGrid(products);
                }
            }
        }
    );
}
/*This function makes HTML product 'card' to show information from database. After all elements created it starts createFooter() function to make page footer.*/
function makeGrid(products) {
    let stockContainer = $('<div>', {class: 'stock-area'}).appendTo('body');
    /*Foreach loop through products array variables to get necessary values for html label fields.*/
    products.forEach(product => {
        let productContainer = $('<div>', {class: 'product page-blocks-alignment'}).appendTo(stockContainer);
        let deleteCheckBoxContainer = $('<div>', {type: 'checkbox', class: 'mass-delete-checkbox'}).appendTo(productContainer);
        $('<input>', {type: 'checkbox', class: 'delete-checkbox', name: product.sku}).appendTo(deleteCheckBoxContainer);
        let productTextContainer = $('<div>', {class: 'product-text-group'}).appendTo(productContainer);
        let skuContainer = $('<div>', {class: 'product-info'}).appendTo(productTextContainer);
        $('<label>', {class: 'form-label', text: product.sku}).appendTo(skuContainer);
        let nameContainer = $('<div>', {class: 'product-info'}).appendTo(productTextContainer);
        $('<label>', {class: 'form-label', text: product.name}).appendTo(nameContainer);
        let priceContainer = $('<div>', {class: 'product-info'}).appendTo(productTextContainer);
        $('<label>', {class: 'form-label', text: product.price + ' $'}).appendTo(priceContainer);
        let productTypeContainer = $('<div>', {class: 'product-info'}).appendTo(productTextContainer);
        $('<label>', {class: 'form-label', text: product.type}).appendTo(productTypeContainer);
        let productAttributeContainer = $('<div>', {class: 'product-info'}).appendTo(productTextContainer);
        $('<label>', {class: 'form-label', text: product.attribute}).appendTo(productAttributeContainer);
    });
    createFooter();
}

function massDelete()
{
    let product = [];

    $('.stock-area input:checkbox:checked').each(
        function () {
            product.push($(this).attr('name'));
        }
    );
    product.push('delete');

    $.ajax(
        {
            type: 'POST',
            url: 'php/Resolver.php',
            dataType: 'json',
            data: {product},
            success: function (data) {
                location.reload();
            }
        }
    );
}