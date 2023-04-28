*** Settings ***
Library    SeleniumLibrary
Resource    ../testdata/environment.robot

*** Variables ***
${GLOBALTIMEOUT}     ${5}
${GLOBALWAITTIME}    ${3}
${SPEEDTIME}    ${1}

*** Keywords ***
Click Element
    [Documentation]    ${locator} - could be any selenium locator and webelement object
    ...    ${timeout} - <optional>
    ...    Make sure that ${GLOBALTIMEOUT} can be accessed globally
    [Arguments]    ${locator}    ${timeout}=${GLOBALTIMEOUT}
    SeleniumLibrary.Wait Until Page Contains Element     ${locator}    timeout=${timeout}
    SeleniumLibrary.Click Element  ${locator}
