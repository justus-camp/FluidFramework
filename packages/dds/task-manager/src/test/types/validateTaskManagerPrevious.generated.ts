/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import type * as old from "@fluidframework/task-manager-previous";
import type * as current from "../../index";


// See 'build-tools/src/type-test-generator/compatibility.ts' for more information.
type TypeOnly<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean | bigint | symbol
	? T
	: {
			[P in keyof T]: TypeOnly<T[P]>;
	  };

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITaskManager": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITaskManager():
    TypeOnly<old.ITaskManager>;
declare function use_current_InterfaceDeclaration_ITaskManager(
    use: TypeOnly<current.ITaskManager>);
use_current_InterfaceDeclaration_ITaskManager(
    get_old_InterfaceDeclaration_ITaskManager());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITaskManager": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITaskManager():
    TypeOnly<current.ITaskManager>;
declare function use_old_InterfaceDeclaration_ITaskManager(
    use: TypeOnly<old.ITaskManager>);
use_old_InterfaceDeclaration_ITaskManager(
    get_current_InterfaceDeclaration_ITaskManager());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITaskManagerEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITaskManagerEvents():
    TypeOnly<old.ITaskManagerEvents>;
declare function use_current_InterfaceDeclaration_ITaskManagerEvents(
    use: TypeOnly<current.ITaskManagerEvents>);
use_current_InterfaceDeclaration_ITaskManagerEvents(
    get_old_InterfaceDeclaration_ITaskManagerEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITaskManagerEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITaskManagerEvents():
    TypeOnly<current.ITaskManagerEvents>;
declare function use_old_InterfaceDeclaration_ITaskManagerEvents(
    use: TypeOnly<old.ITaskManagerEvents>);
use_old_InterfaceDeclaration_ITaskManagerEvents(
    get_current_InterfaceDeclaration_ITaskManagerEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_TaskEventListener": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_TaskEventListener():
    TypeOnly<old.TaskEventListener>;
declare function use_current_TypeAliasDeclaration_TaskEventListener(
    use: TypeOnly<current.TaskEventListener>);
use_current_TypeAliasDeclaration_TaskEventListener(
    get_old_TypeAliasDeclaration_TaskEventListener());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_TaskEventListener": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_TaskEventListener():
    TypeOnly<current.TaskEventListener>;
declare function use_old_TypeAliasDeclaration_TaskEventListener(
    use: TypeOnly<old.TaskEventListener>);
use_old_TypeAliasDeclaration_TaskEventListener(
    get_current_TypeAliasDeclaration_TaskEventListener());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TaskManager": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TaskManager():
    TypeOnly<old.TaskManager>;
declare function use_current_ClassDeclaration_TaskManager(
    use: TypeOnly<current.TaskManager>);
use_current_ClassDeclaration_TaskManager(
    get_old_ClassDeclaration_TaskManager());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TaskManager": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TaskManager():
    TypeOnly<current.TaskManager>;
declare function use_old_ClassDeclaration_TaskManager(
    use: TypeOnly<old.TaskManager>);
use_old_ClassDeclaration_TaskManager(
    get_current_ClassDeclaration_TaskManager());
