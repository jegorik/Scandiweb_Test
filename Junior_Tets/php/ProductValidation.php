<?php

/**
 * Class ProductValidation
 * This class validates information from web form
 */
class ProductValidation extends Resolver implements Validator
{
    /*This variable contains validation status. By default false.*/
    private bool $validationStatus = false;

    /*Public function to call ProductValidation procedure outside class. Receives input fields data.*/
    public function makeValidation($formData): array
    {
        return $this->doFormValidation($formData);
    }

    /*This function starts form input fields data validation procedure. */
    private function doFormValidation(array $formData): array
    {
        /*Creating new object of the class Warehouse to get access for public function, to receive array with stored products name.*/
        unset($formData['save']);
        $warehouse = new \Warehouse();
        /*Storing received array in new variable.*/
        $products = $warehouse->getProducts();
        /*Empty array for storing errors information in validation process.*/
        $errors = array();
        /*Empty array for storing information about validation steps. If validation step successfully complete - stores true value, otherwise false.*/
        $validationStepsResult = array();
        /*Empty variable for upgrading 'attribute' field information to future store in database.*/
        $attribute = '';
        /*This empty array will stores "clear" input field data, after validation process.*/
        $validDataArray = array();
        /*Loop to check input fields data.*/
        foreach ($formData as $fieldName => $fieldInputData) {
            /*New variable to store input field data for future validation process.*/
            $data = $fieldInputData;
            /*ProductValidation steps to prevent "injection" in input fields data.*/
            $data = htmlspecialchars($data);
            $data = trim($data);
            $data = strip_tags($data);
            $data = stripslashes($data);
            /*Checking input field data for empty or null value.*/
            if (empty($data) || $data === null) {
                /*If true - save error information in $errors array.*/
                $errors[] = $fieldName . ' field is empty or null!';
                /*Make this validation step false.*/
                $validationStepsResult[] = false;
                /*Check "Type Switcher" field value. This step try to prevent a "wrong product" "injection".*/
            } elseif ($fieldName === 'productType') {
                /*If product name not found in Warehouse class array, then validation step false.*/
                if (!in_array($data, $products)) {
                    $errors[] = $data . ' wrong product in "Type Switcher" field!';
                    $validationStepsResult[] = false;
                    return $errors;
                }
            } else {
                /*Conditional (ternary) operator to check input field data by regex patterns using fieldInputValidation() function.
                If step successfully - save true value in $validationStepsResult[] array, otherwise save error data in $errors[] array.*/
                $this->fieldInputValidation(
                    $data,
                    $fieldName
                ) ? $validationStepsResult[] = true : $errors[] = $fieldName . ' ' . $data . ' not allowed value!';
            }
            /*After validation steps, stores "clear" and "correct" input field data to a new array ($validDataArray).*/
            $validDataArray[$fieldName] = $data;
        }
        /*Update info in attribute field.*/
        $attribute = $this->attributeFieldUpdater($validDataArray);
        /*Adds to array updated attribute field.*/
        $validDataArray['attribute'] = $attribute;
        if (!in_array(false, $validationStepsResult, true)) {
            $this->validationStatus = true;
            return $validDataArray;
        }
        return $errors;
    }

    /*Function to check input fields regex, using patters, stored in $patternContainer array.*/
    private function fieldInputValidation(string $data, string $fieldName): bool
    {
        /*Creating new variable to store correct pattern for a input field data, using getPattern() function.*/
        $pattern = $this->getPattern($fieldName);
        /*Check input field data using patterns by preg_match() function. If step successfully returns 1, otherwise null.*/
        return preg_match($pattern, $data);
    }

    /*Function to get patterns from $patternContainer array for regex validation.*/
    private function getPattern(string $fieldName): string
    {
        /*Array to store patterns for input fields regex check.*/
        $patternContainer = [
            'sku' => '/^([\d+\w+]{3,20})$/',
            'name' => '/^([\w+\W+]{2,50})$/',
            'price' => '/^(\d{1,8})(,\d{1,2})?$/',
            'size' => '/^(\d{1,5})(,\d{1,3})?$/',
            'weight' => '/^(\d{1,5})(,\d{1,3})?$/',
            'height' => '/^(\d{1,4})(,\d{1,3})?$/',
            'width' => '/^(\d{1,4})(,\d{1,3})?$/',
            'length' => '/^(\d{1,4})(,\d{1,3})?$/'
        ];
        /*Returns pattern according input field name.*/
        return $patternContainer[$fieldName];
    }

    /*Function to update attribute field information. Returns attribute string with additional information.*/
    private function attributeFieldUpdater(array $validDataArray): string
    {
        $attributeFieldInfo = [
            'Dvd' => 'Size: ' . $validDataArray['size'] . ' MB',
            'Book' => 'Weight: ' . $validDataArray['weight'] . ' KG',
            'Furniture' => 'Dimension: ' . $validDataArray['height'] . 'x' . $validDataArray['width'] . 'x' . $validDataArray['length']
        ];
        return $attributeFieldInfo[$validDataArray['productType']];
    }

    /*This getter returns validation status.*/
    public function isValidationStatus(): bool
    {
        return $this->validationStatus;
    }

}