require "application_system_test_case"

class EarElementsTest < ApplicationSystemTestCase
  setup do
    @ear_element = ear_elements(:one)
  end

  test "visiting the index" do
    visit ear_elements_url
    assert_selector "h1", text: "Ear Elements"
  end

  test "creating a Ear element" do
    visit ear_elements_url
    click_on "New Ear Element"

    fill_in "Img", with: @ear_element.img
    fill_in "Name", with: @ear_element.name
    click_on "Create Ear element"

    assert_text "Ear element was successfully created"
    click_on "Back"
  end

  test "updating a Ear element" do
    visit ear_elements_url
    click_on "Edit", match: :first

    fill_in "Img", with: @ear_element.img
    fill_in "Name", with: @ear_element.name
    click_on "Update Ear element"

    assert_text "Ear element was successfully updated"
    click_on "Back"
  end

  test "destroying a Ear element" do
    visit ear_elements_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Ear element was successfully destroyed"
  end
end
