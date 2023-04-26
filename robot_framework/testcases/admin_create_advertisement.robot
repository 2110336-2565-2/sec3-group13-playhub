*** Settings ***
Library    SeleniumLibrary
Resource    ../keywords/commonKeywords.robot
Resource    ../keywords/loginKeywords.robot
Test Teardown    Close All Browsers

*** Variables ***
${test_advertise_owner}     Myname Isowner
${test_advertise_duration}  1
${test_advertise_image}     C:/Users/SoulCRYSIS/Desktop/Developer/Project/sec3-group13-playhub/robot_framework/testdata/images/test_advertise_image.jpg
${owner_empty_error_message}  This field cannot be blank.
${duration_empty_error_message}   Please select advertisement’s duration. 
${image_empty_error_message}  Please upload advertisement’s image. 
${confirm_add_message}      Add this advertisement ?
${add_advertise_title}      Add Advertisement

*** Keywords ***
Click navigate to admin add advertise
    Click Element   //p[contains(text(), '/admin/advertise')]

Wait add advertise load complete
    Wait Until Page Contains Element    //h1[contains(text(), '${add_advertise_title}')] 

Input and verify owner
    Input text   //input[@type='text']    ${test_advertise_owner}
    ${value}    Get value   //input[@type='text']
    Should Be Equal    ${value}    ${test_advertise_owner} 

Input and verify duration
    Click Element   //input[@type='radio' and @value=${test_advertise_duration}]   
    SeleniumLibrary.Radio Button Should Be Set To   :r1d:   ${test_advertise_duration}

Input and verify image
    Choose File    //input[@type='file']    ${test_advertise_image}
    Page Should Contain Element     //*[@title='poster file']

Submit add advertise
    Click Element   //button[contains(text(), 'Add')]

Verify owner error message
    Page Should Contain Element     //*[contains(text(), '${owner_empty_error_message}')]

Verify duration error message
    Page Should Contain Element     //*[contains(text(), "${duration_empty_error_message}")] 

Verify image error message
    Page Should Contain Element     //*[contains(text(), "${image_empty_error_message}")]

Check submit success
    Page Should Contain Element     //*[contains(text(), '${confirm_add_message}')]

*** Test Cases ***
TC4-1 empty owner
    [Tags]    invalid
    Open browser login page
    Wait login form load complete
    Login as admin
    Click navigate to admin add advertise
    Wait add advertise load complete
    Input and verify duration
    Input and verify image
    Submit add advertise
    Verify owner error message

TC4-2 empty duration
    [Tags]    invalid
    Open browser login page
    Wait login form load complete
    Login as admin
    Click navigate to admin add advertise
    Wait add advertise load complete
    Input and verify owner
    Input and verify image
    Submit add advertise
    Verify duration error message

TC4-3 empty image
    [Tags]    invalid
    Open browser login page
    Wait login form load complete
    Login as admin
    Click navigate to admin add advertise
    Wait add advertise load complete
    Input and verify owner
    Input and verify duration
    Submit add advertise
    Verify image error message

TC4-4 empty owner
    [Tags]    valid
    Open browser login page
    Wait login form load complete
    Login as admin
    Click navigate to admin add advertise
    Wait add advertise load complete
    Input and verify owner
    Input and verify duration
    Input and verify image
    Submit add advertise
    Check submit success