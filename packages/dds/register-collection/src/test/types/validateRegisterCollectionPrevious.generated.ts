/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/register-collection-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollection": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ConsensusRegisterCollection():
    TypeOnly<old.ConsensusRegisterCollection<any>>;
declare function use_current_ClassDeclaration_ConsensusRegisterCollection(
    use: TypeOnly<current.ConsensusRegisterCollection<any>>);
use_current_ClassDeclaration_ConsensusRegisterCollection(
    // @ts-expect-error compatibility expected to be broken
    get_old_ClassDeclaration_ConsensusRegisterCollection());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollection": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ConsensusRegisterCollection():
    TypeOnly<current.ConsensusRegisterCollection<any>>;
declare function use_old_ClassDeclaration_ConsensusRegisterCollection(
    use: TypeOnly<old.ConsensusRegisterCollection<any>>);
use_old_ClassDeclaration_ConsensusRegisterCollection(
    get_current_ClassDeclaration_ConsensusRegisterCollection());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollectionFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ConsensusRegisterCollectionFactory():
    TypeOnly<old.ConsensusRegisterCollectionFactory>;
declare function use_current_ClassDeclaration_ConsensusRegisterCollectionFactory(
    use: TypeOnly<current.ConsensusRegisterCollectionFactory>);
use_current_ClassDeclaration_ConsensusRegisterCollectionFactory(
    get_old_ClassDeclaration_ConsensusRegisterCollectionFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollectionFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ConsensusRegisterCollectionFactory():
    TypeOnly<current.ConsensusRegisterCollectionFactory>;
declare function use_old_ClassDeclaration_ConsensusRegisterCollectionFactory(
    use: TypeOnly<old.ConsensusRegisterCollectionFactory>);
use_old_ClassDeclaration_ConsensusRegisterCollectionFactory(
    get_current_ClassDeclaration_ConsensusRegisterCollectionFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollection": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollection():
    TypeOnly<old.IConsensusRegisterCollection>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollection(
    use: TypeOnly<current.IConsensusRegisterCollection>);
use_current_InterfaceDeclaration_IConsensusRegisterCollection(
    get_old_InterfaceDeclaration_IConsensusRegisterCollection());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollection": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollection():
    TypeOnly<current.IConsensusRegisterCollection>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollection(
    use: TypeOnly<old.IConsensusRegisterCollection>);
use_old_InterfaceDeclaration_IConsensusRegisterCollection(
    get_current_InterfaceDeclaration_IConsensusRegisterCollection());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents():
    TypeOnly<old.IConsensusRegisterCollectionEvents>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    use: TypeOnly<current.IConsensusRegisterCollectionEvents>);
use_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    get_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents():
    TypeOnly<current.IConsensusRegisterCollectionEvents>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    use: TypeOnly<old.IConsensusRegisterCollectionEvents>);
use_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    get_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionFactory": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory():
    TypeOnly<old.IConsensusRegisterCollectionFactory>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    use: TypeOnly<current.IConsensusRegisterCollectionFactory>);
use_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    get_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionFactory": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory():
    TypeOnly<current.IConsensusRegisterCollectionFactory>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    use: TypeOnly<old.IConsensusRegisterCollectionFactory>);
use_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    get_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ReadPolicy": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ReadPolicy():
    TypeOnly<old.ReadPolicy>;
declare function use_current_EnumDeclaration_ReadPolicy(
    use: TypeOnly<current.ReadPolicy>);
use_current_EnumDeclaration_ReadPolicy(
    get_old_EnumDeclaration_ReadPolicy());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ReadPolicy": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ReadPolicy():
    TypeOnly<current.ReadPolicy>;
declare function use_old_EnumDeclaration_ReadPolicy(
    use: TypeOnly<old.ReadPolicy>);
use_old_EnumDeclaration_ReadPolicy(
    get_current_EnumDeclaration_ReadPolicy());
