/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/matrix-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRevertible": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IRevertible():
    TypeOnly<old.IRevertible>;
declare function use_current_InterfaceDeclaration_IRevertible(
    use: TypeOnly<current.IRevertible>);
use_current_InterfaceDeclaration_IRevertible(
    get_old_InterfaceDeclaration_IRevertible());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRevertible": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IRevertible():
    TypeOnly<current.IRevertible>;
declare function use_old_InterfaceDeclaration_IRevertible(
    use: TypeOnly<old.IRevertible>);
use_old_InterfaceDeclaration_IRevertible(
    get_current_InterfaceDeclaration_IRevertible());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IUndoConsumer": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IUndoConsumer():
    TypeOnly<old.IUndoConsumer>;
declare function use_current_InterfaceDeclaration_IUndoConsumer(
    use: TypeOnly<current.IUndoConsumer>);
use_current_InterfaceDeclaration_IUndoConsumer(
    get_old_InterfaceDeclaration_IUndoConsumer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IUndoConsumer": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IUndoConsumer():
    TypeOnly<current.IUndoConsumer>;
declare function use_old_InterfaceDeclaration_IUndoConsumer(
    use: TypeOnly<old.IUndoConsumer>);
use_old_InterfaceDeclaration_IUndoConsumer(
    get_current_InterfaceDeclaration_IUndoConsumer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_MatrixItem": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_MatrixItem():
    TypeOnly<old.MatrixItem<any>>;
declare function use_current_TypeAliasDeclaration_MatrixItem(
    use: TypeOnly<current.MatrixItem<any>>);
use_current_TypeAliasDeclaration_MatrixItem(
    get_old_TypeAliasDeclaration_MatrixItem());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_MatrixItem": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_MatrixItem():
    TypeOnly<current.MatrixItem<any>>;
declare function use_old_TypeAliasDeclaration_MatrixItem(
    use: TypeOnly<old.MatrixItem<any>>);
use_old_TypeAliasDeclaration_MatrixItem(
    get_current_TypeAliasDeclaration_MatrixItem());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrix": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedMatrix():
    TypeOnly<old.SharedMatrix>;
declare function use_current_ClassDeclaration_SharedMatrix(
    use: TypeOnly<current.SharedMatrix>);
use_current_ClassDeclaration_SharedMatrix(
    // @ts-expect-error compatibility expected to be broken
    get_old_ClassDeclaration_SharedMatrix());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrix": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SharedMatrix():
    TypeOnly<current.SharedMatrix>;
declare function use_old_ClassDeclaration_SharedMatrix(
    use: TypeOnly<old.SharedMatrix>);
use_old_ClassDeclaration_SharedMatrix(
    get_current_ClassDeclaration_SharedMatrix());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrixFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedMatrixFactory():
    TypeOnly<old.SharedMatrixFactory>;
declare function use_current_ClassDeclaration_SharedMatrixFactory(
    use: TypeOnly<current.SharedMatrixFactory>);
use_current_ClassDeclaration_SharedMatrixFactory(
    get_old_ClassDeclaration_SharedMatrixFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrixFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SharedMatrixFactory():
    TypeOnly<current.SharedMatrixFactory>;
declare function use_old_ClassDeclaration_SharedMatrixFactory(
    use: TypeOnly<old.SharedMatrixFactory>);
use_old_ClassDeclaration_SharedMatrixFactory(
    get_current_ClassDeclaration_SharedMatrixFactory());
