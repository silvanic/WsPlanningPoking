import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function isValidCustomSuit(separator: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return control.value === null ||
            (control.value.length>0 && control.value.split(separator).length>1) 
            ? null
            : {
                invalid : {
                    customSuit: control.value
                }
            }
        ;
    }
}