*** Settings ***
Resource    ../testdata/environment.robot
Resource    commonKeywords.robot

*** Variables ***
${test_admin_email}    oommankung@gmail.com
${test_admin_password}    777777
${login_url}    ${WEB_URL}/login

*** Keywords ***
Open browser login page
    Open Browser    ${login_url}    ${WEB_BROWSER}
    Maximize Browser Window
    Sleep    1

Wait login form load complete
    Wait Until Page Contains Element    //button[contains(text(), 'Login')]

Login as admin
    Input text    //input[@name='email']    ${test_admin_email}    True
    Input text    //input[@name='password']    ${test_admin_password}    True
    Click Element  //button[contains(text(), 'Login')]
    