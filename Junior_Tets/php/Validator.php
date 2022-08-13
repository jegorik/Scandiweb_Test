<?php

/*Interface class to implement validation process logic.*/

interface Validator
{
    public function makeValidation($formData);

    public function isValidationStatus();
}