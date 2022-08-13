<?php

/*Connect classLoader script.*/
require_once 'classLoader.php';

/*Creating new object of a class Resolver to start processing input fields data.*/
$resolver = new Resolver();
/*Receiving form data by POST function and putting it to an array.*/
$formData = $_POST['product'];
$result = null;
/*Checking if data from POST function is empty.*/
switch ($formData) {
    case(in_array('save', $formData, true)) :
        if (!empty($formData)) {
            /*POST is not empty. Starts validation process.*/
            echo json_encode($resolver->startValidation($formData), JSON_THROW_ON_ERROR);
        } else {
            /*POST is empty. Returns error.*/
            echo json_encode($result['Empty POST data.'], JSON_THROW_ON_ERROR);
        }
        break;
    case(in_array('load', $formData, true)) :
        echo json_encode($resolver->loadDataFromDatabase(), JSON_THROW_ON_ERROR);
        break;
    case (in_array('delete', $formData, true)) :
        echo json_encode($resolver->deleteDataFromDatabase($formData), JSON_THROW_ON_ERROR);
        break;
}

class Resolver
{
    /*Function to make form data validation.*/
    public function startValidation(array $formData): array
    {
        /*Creating new object of a class ProductValidation to use it public functions.*/
        $validation = new \ProductValidation();
        /*Stores validation result in new variable.*/
        $validationResult = $validation->makeValidation($formData);
        /*Check validation status.*/
        $validationStatus = $validation->isValidationStatus();
        /*Depending of $validationStatus make next steps. If true, run function saveToDatabase() to save form data to database,
        otherwise returns errors.*/
        if ($validationStatus) {
            return $this->saveToDatabase($validationResult);
        } else {
            return $validationResult;
        }
    }

    /*This function starts data saving process to a database.*/
    private function saveToDatabase(array $validationResult): array
    {
        /*Get productTyp.*/
        $productType = $validationResult['productType'];
        /*Create new Warehouse class, to get access to it public functions.*/
        $warehouse = new \Warehouse();
        /*Get class name from Warehouse "Products" array.*/
        $productClass = $warehouse->getClassName($productType);
        /*Create new product.*/
        $product = new  $productClass();
        $product->setSku($validationResult['sku']);
        $product->setName($validationResult['name']);
        $product->setPrice($validationResult['price']);
        $product->setType($validationResult['productType']);
        $product->setAttribute($validationResult['attribute']);
        return (new Database())->doSave($product);
    }
    /*This function starts product data loading procedure.*/
    public function loadDataFromDatabase(): array
    {
        return (new Database())->loadData();
    }
    /*This function removes product data from database.*/
    public function deleteDataFromDatabase($formData): string
    {
        return (new Database())->deleteData($formData);
    }
}