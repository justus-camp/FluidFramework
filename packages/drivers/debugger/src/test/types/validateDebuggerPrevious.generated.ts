/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/debugger-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DebugReplayController": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_DebugReplayController():
    TypeOnly<old.DebugReplayController>;
declare function use_current_ClassDeclaration_DebugReplayController(
    use: TypeOnly<current.DebugReplayController>);
use_current_ClassDeclaration_DebugReplayController(
    get_old_ClassDeclaration_DebugReplayController());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DebugReplayController": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_DebugReplayController():
    TypeOnly<current.DebugReplayController>;
declare function use_old_ClassDeclaration_DebugReplayController(
    use: TypeOnly<old.DebugReplayController>);
use_old_ClassDeclaration_DebugReplayController(
    get_current_ClassDeclaration_DebugReplayController());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DebuggerUI": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_DebuggerUI():
    TypeOnly<old.DebuggerUI>;
declare function use_current_ClassDeclaration_DebuggerUI(
    use: TypeOnly<current.DebuggerUI>);
use_current_ClassDeclaration_DebuggerUI(
    get_old_ClassDeclaration_DebuggerUI());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DebuggerUI": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_DebuggerUI():
    TypeOnly<current.DebuggerUI>;
declare function use_old_ClassDeclaration_DebuggerUI(
    use: TypeOnly<old.DebuggerUI>);
use_old_ClassDeclaration_DebuggerUI(
    get_current_ClassDeclaration_DebuggerUI());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_FluidDebugger.createFromService": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_FluidDebugger_createFromService():
    TypeOnly<typeof old.FluidDebugger.createFromService>;
declare function use_current_FunctionDeclaration_FluidDebugger_createFromService(
    use: TypeOnly<typeof current.FluidDebugger.createFromService>);
use_current_FunctionDeclaration_FluidDebugger_createFromService(
    get_old_FunctionDeclaration_FluidDebugger_createFromService());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_FluidDebugger.createFromService": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_FluidDebugger_createFromService():
    TypeOnly<typeof current.FluidDebugger.createFromService>;
declare function use_old_FunctionDeclaration_FluidDebugger_createFromService(
    use: TypeOnly<typeof old.FluidDebugger.createFromService>);
use_old_FunctionDeclaration_FluidDebugger_createFromService(
    get_current_FunctionDeclaration_FluidDebugger_createFromService());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_FluidDebugger.createFromServiceFactory": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_FluidDebugger_createFromServiceFactory():
    TypeOnly<typeof old.FluidDebugger.createFromServiceFactory>;
declare function use_current_FunctionDeclaration_FluidDebugger_createFromServiceFactory(
    use: TypeOnly<typeof current.FluidDebugger.createFromServiceFactory>);
use_current_FunctionDeclaration_FluidDebugger_createFromServiceFactory(
    get_old_FunctionDeclaration_FluidDebugger_createFromServiceFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_FluidDebugger.createFromServiceFactory": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_FluidDebugger_createFromServiceFactory():
    TypeOnly<typeof current.FluidDebugger.createFromServiceFactory>;
declare function use_old_FunctionDeclaration_FluidDebugger_createFromServiceFactory(
    use: TypeOnly<typeof old.FluidDebugger.createFromServiceFactory>);
use_old_FunctionDeclaration_FluidDebugger_createFromServiceFactory(
    get_current_FunctionDeclaration_FluidDebugger_createFromServiceFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDebuggerController": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IDebuggerController():
    TypeOnly<old.IDebuggerController>;
declare function use_current_InterfaceDeclaration_IDebuggerController(
    use: TypeOnly<current.IDebuggerController>);
use_current_InterfaceDeclaration_IDebuggerController(
    get_old_InterfaceDeclaration_IDebuggerController());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDebuggerController": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IDebuggerController():
    TypeOnly<current.IDebuggerController>;
declare function use_old_InterfaceDeclaration_IDebuggerController(
    use: TypeOnly<old.IDebuggerController>);
use_old_InterfaceDeclaration_IDebuggerController(
    get_current_InterfaceDeclaration_IDebuggerController());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDebuggerUI": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IDebuggerUI():
    TypeOnly<old.IDebuggerUI>;
declare function use_current_InterfaceDeclaration_IDebuggerUI(
    use: TypeOnly<current.IDebuggerUI>);
use_current_InterfaceDeclaration_IDebuggerUI(
    get_old_InterfaceDeclaration_IDebuggerUI());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDebuggerUI": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IDebuggerUI():
    TypeOnly<current.IDebuggerUI>;
declare function use_old_InterfaceDeclaration_IDebuggerUI(
    use: TypeOnly<old.IDebuggerUI>);
use_old_InterfaceDeclaration_IDebuggerUI(
    get_current_InterfaceDeclaration_IDebuggerUI());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_debuggerUIFactory": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_debuggerUIFactory():
    TypeOnly<old.debuggerUIFactory>;
declare function use_current_TypeAliasDeclaration_debuggerUIFactory(
    use: TypeOnly<current.debuggerUIFactory>);
use_current_TypeAliasDeclaration_debuggerUIFactory(
    get_old_TypeAliasDeclaration_debuggerUIFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_debuggerUIFactory": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_debuggerUIFactory():
    TypeOnly<current.debuggerUIFactory>;
declare function use_old_TypeAliasDeclaration_debuggerUIFactory(
    use: TypeOnly<old.debuggerUIFactory>);
use_old_TypeAliasDeclaration_debuggerUIFactory(
    get_current_TypeAliasDeclaration_debuggerUIFactory());
