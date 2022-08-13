/*
Waiting for a page load and starts to create main html elements of the page, using specific functions.
Two event handlers starts after that.
 */
$(function () {

    /*This function creates page "header", a block with page Name and control buttons ('Save', 'Cancel'). */
    createHeader();

    /*This function creates page 'body content', a block with form, labels and input fields. */
    createBodyContent();

    /*A page footer block is created by this function.*/
    createFooter();

    /*This function create fields for 'select' element.*/
    createProductsOptionsList();

    /*This event handle for a 'switch' block, activate hide function of a 'dummy field' and also send a switched value
    to a function, for creating a specific attribute field, according selected value (product type). */
    $('#productType').on('change', function () {
        $('#dummy-section').hide();
        createProductAttributes((this.value).toLowerCase());
    });

    /*Event handler for a 'Cancel' button. After the button was pressed, redirect to a page in the location field. */
    $('.cancel').on('click', function () {
        window.location.href = 'product_list.html';
    });

    /*Event handler for a 'Save' button. After the button was pressed, redirect 'product_form' input fields information to saveProduct() function.
      e.preventDefault() function prevents page reload. All inputs information goes through foreach loop to the MAP object as [key, value] for a sending to a php script.  */
    $('#product_form').on('submit', function (e) {
        e.preventDefault();
        let product = {};
        $(this).find(':input').each(function () {
            product[$(this).attr('name')] = $(this).val();
        });
        product['save'] = 'save';
        saveProduct(product, 'php/Resolver.php');
        console.log(product);
    });

});

/*A function for a 'input' fields value validation. Get 'value' and 'id' from input field and redirect it for a validation procedure
to a regexCheck() function. After creates new class 'inValid' to the input field, if regexCheck() function result is 'false'. */
function inputValidation() {
    $('input').on('change', function () {
        let id = this.id;
        let value = this.value;
        let valid = regexCheck(id, value);
        this.classList.toggle('inValid', !valid);
    });
}

/*This function check input field validation according field specific regex pattern. Function receives 'value' and 'id'
from inputValidation() function and according to 'id', receive a pattern from getPattern() function. When pattern received,
this function makes validation check by using RegExp() function and received value of the input field. */
function regexCheck(id, value) {
    let pattern = getPattern(id);
    let regex = new RegExp(pattern);
    return regex.test(value);
}

/*This function returns regex pattern from patternContainer array, according to received input field 'id'. */
function getPattern(id) {
    let patternContainer = {
        sku: '^[\\w\\d]{3,20}$',
        name: '^[\\w\\W]{2,50}$',
        price: '^\\d+(,\\d{1,2})?$',
        size: '^\\d+(,\\d{1,3})?$',
        weight: '^\\d+(,\\d{1,3})?$',
        height: '^\\d+(,\\d{1,3})?$',
        width: '^\\d+(,\\d{1,3})?$',
        length: '^\\d+(,\\d{1,3})?$'
    };
    return patternContainer[id];
}

/*Function for creating page "header". Contains div elements to combine html elements (label, input, hr) for css stylization.  */
function createHeader() {
    let headerContainer = $('<div>', {id: 'header-container', class: 'page-blocks-alignment header'}).appendTo('body');
    $('<label>', {text: 'Product Add', class: 'form-name'}).appendTo(headerContainer);
    let buttonsContainer = $('<div>', {class: 'form-list-menu'}).appendTo(headerContainer);
    $('<input>', {type: 'submit', form: 'product_form', val: 'Save', class: 'page-buttons'}).appendTo(buttonsContainer);
    $('<input>', {type: 'button', val: 'Cancel', class: 'page-buttons cancel'}).appendTo(buttonsContainer);
    $('<hr>', {class: 'page-blocks-alignment'}).appendTo('body');
}

/*Function for creating page "form content". Contains div elements to combine html elements for css stylization.
Also contains inputValidation() function for 'input' fields validation process.  */
function createBodyContent() {
    let productFormContainer = $('<form>', {id: 'product_form', class: 'page-blocks-alignment'});
    let productFieldsWrapper = $('<div>', {class: 'product-field'});
    productFormContainer.appendTo('body');
    productFieldsWrapper.appendTo(productFormContainer);
    $('<label>', {for: 'sku', text: 'SKU', class: 'product-label'}).appendTo(productFieldsWrapper);
    $('<input>', {
        id: 'sku',
        name: 'sku',
        class: 'product-input',
        maxlength: '20',
        title: 'Can contain letters and numbers. Min length 3, max 20 symbols.',
        required: true
    }).appendTo(productFieldsWrapper);
    $('<label>', {for: 'name', text: 'Name', class: 'product-label'}).appendTo(productFieldsWrapper);
    $('<input>', {
        id: 'name',
        name: 'name',
        class: 'product-input',
        maxlength: '50',
        title: 'Can contain letters, numbers, symbols. Max length 50 symbols.',
        required: true
    }).appendTo(productFieldsWrapper);
    $('<label>', {for: 'price', text: 'Price in ($)', class: 'product-label'}).appendTo(productFieldsWrapper);
    $('<input>', {
        id: 'price',
        name: 'price',
        class: 'product-input',
        maxlength: '8',
        title: 'Only numbers and , allowed. Max length 8 digit.',
        required: true
    }).appendTo(productFieldsWrapper);
    $('<label>', {for: 'productType', text: 'Type Switcher', class: 'product-label'}).appendTo(productFieldsWrapper);
    $('<select>', {
        id: 'productType',
        name: 'productType',
        class: 'product-input',
        required: true
    }).appendTo(productFieldsWrapper);
    $('<option>', {text: 'Select Product', id: 'dummy-section', val: null, selected: true}).appendTo('#productType');
    $('<div>', {id: 'product-attributes'}).appendTo(productFormContainer);
    inputValidation();
}

/*Function for creating page "footer". Contains div elements to combine html elements for css stylization. */
function createFooter() {
    let footer = $('<footer>');
    footer.appendTo('body');
    $('<hr>', {class: 'page-blocks-alignment'}).appendTo(footer);
    let footerContainer = $('<div>', {class: 'page-blocks-alignment footer-text'});
    footerContainer.appendTo(footer);
    $('<label>', {text: 'Scandiweb Test assignment'}).appendTo(footerContainer);
}

/*This function creates 'select' element 'option' fields, taken fields 'text' and 'value' from productList array.  */
function createProductsOptionsList() {
    let productList = ['Dvd', 'Book', 'Furniture'];
    let select = $('#productType');
    for (let i = 0; i < productList.length; i++) {
        let productName = $('<option>');
        productName.val(productList[i]);
        productName.text(productList[i]);
        productName.appendTo(select);
    }
}

/*This function works as "html fields remover". It's checking existence of specific html
elements ('#product-attributes', '#description') by 'id' and in the case they exist, removes them. */
function checkContainersExistence() {
    let attributesField = getAttributeContainer();
    let descriptionField = getDescriptionContainer();
    if (attributesField && descriptionField) {
        $(attributesField).remove();
        $(descriptionField).remove();
    }
}

/*Function returns 'id' of html element. */
function getProductContainer() {
    return $('#product-attributes');
}

/*Function returns 'id' of html element. */
function getAttributeContainer() {
    return $('#attribute');
}

/*Function returns 'id' of html element. */
function getDescriptionContainer() {
    return $('#description');
}

/*This function make a "wrapper", a div element to combine a specific html field for stylization and also
for a possibility to remove them from a page, using checkContainersExistence().  */
function makeAttributeContainer() {
    return $('<div>', {id: 'attribute', class: 'product-field'});
}

/*This function make a "wrapper", a div element to combine a specific html field for stylization and also
for a possibility to remove them from a page, using checkContainersExistence().  */
function makeDescriptionContainer() {
    return $('<div>', {id: 'description'}).appendTo(getProductContainer());
}

/*This function checks existence of a html elements ('#product-attributes', '#description'), removes them if they already exist
and creates new html elements according 'value' (which also exist as a functions for creating specific attributes fields for products). */
function createProductAttributes(value) {
    checkContainersExistence();
    $("#product-attributes").html(window[value]);
}

/*A function to create a product attribute fields. Also contains inputValidation() function to validate 'input' fields values.  */
function dvd() {
    let attributes = makeAttributeContainer().appendTo(getProductContainer());
    $('<label>', {text: 'Size in (MB)', class: 'product-label'}).appendTo(attributes);
    $('<input>', {
        id: 'size',
        name: 'size',
        class: 'product-input',
        maxlength: '5',
        title: 'Only numbers and , allowed. Max length 5 digit.',
        required: true
    }).appendTo(attributes);
    let description = makeDescriptionContainer();
    $('<label>', {text: 'Please provide disk size in Mb.', class: 'description-label'}).appendTo(description);
    inputValidation();
}

/*A function to create a product attribute fields. Also contains inputValidation() function to validate 'input' fields values.  */
function book() {
    let attributes = makeAttributeContainer().appendTo(getProductContainer());
    $('<label>', {text: 'Weight in (KG)', class: 'product-label'}).appendTo(attributes);
    $('<input>', {
        id: 'weight',
        name: 'weight',
        class: 'product-input',
        maxlength: '5',
        title: 'Only numbers and , allowed. Max length 4 digit.',
        required: true
    }).appendTo(attributes);
    let description = makeDescriptionContainer();
    $('<label>', {text: 'Please provide book weight in Kg.', class: 'description-label'}).appendTo(description);
    inputValidation();
}

/*A function to create a product attribute fields. Also contains inputValidation() function to validate 'input' fields values.  */
function furniture() {
    let attributes = makeAttributeContainer().appendTo(getProductContainer());
    $('<label>', {text: 'Height in (CM)', class: 'product-label'}).appendTo(attributes);
    $('<input>', {
        id: 'height',
        name: 'height',
        class: 'product-input',
        maxlength: '4',
        title: 'Only numbers and , allowed. Max length 4 digit.',
        required: true
    }).appendTo(attributes);
    $('<label>', {text: 'Width in (CM)', class: 'product-label'}).appendTo(attributes);
    $('<input>', {
        id: 'width',
        name: 'width',
        class: 'product-input',
        maxlength: '4',
        title: 'Only numbers and , allowed. Max length 4 digit.',
        required: true
    }).appendTo(attributes);
    $('<label>', {text: 'Length in (CM)', class: 'product-label'}).appendTo(attributes);
    $('<input>', {
        id: 'length',
        name: 'length',
        class: 'product-input',
        maxlength: '4',
        title: 'Only numbers and , allowed. Max length 4 digit.',
        required: true
    }).appendTo(attributes);
    let description = makeDescriptionContainer();
    $('<label>', {
        text: 'Please provide dimensions in HxWxL format using cm.',
        class: 'description-label'
    }).appendTo(description);
    inputValidation();
}

/*This function receives data from 'submit' event handler and post it to php script. Also, it's checks state of sending (success/unsuccessful). */
function saveProduct(product, path) {
    $.ajax({
        type: 'POST',
        url: path,
        dataType: 'json',
        data: {product},
        success: function callback(data) {
            if (data.success) {
                window.location.href = 'product_list.html';
            } else {
                let errorArray = Object.values(data).join('\n');
                alert(errorArray);
            }
        }
    });
}