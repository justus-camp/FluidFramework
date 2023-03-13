/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/mocha-test-setup-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_mochaHooks": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_mochaHooks():
    TypeOnly<typeof old.mochaHooks>;
declare function use_current_VariableDeclaration_mochaHooks(
    use: TypeOnly<typeof current.mochaHooks>);
use_current_VariableDeclaration_mochaHooks(
    get_old_VariableDeclaration_mochaHooks());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_mochaHooks": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_mochaHooks():
    TypeOnly<typeof current.mochaHooks>;
declare function use_old_VariableDeclaration_mochaHooks(
    use: TypeOnly<typeof old.mochaHooks>);
use_old_VariableDeclaration_mochaHooks(
    get_current_VariableDeclaration_mochaHooks());
