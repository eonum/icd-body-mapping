require "application_system_test_case"

class IcdsTest < ApplicationSystemTestCase
  setup do
    @icd = icds(:one)
  end

  test "visiting the index" do
    visit icds_url
    assert_selector "h1", text: "Icds"
  end

  test "creating a Icd" do
    visit icds_url
    click_on "New Icd"

    fill_in "Code", with: @icd.code
    fill_in "Text de", with: @icd.text_de
    fill_in "Text fr", with: @icd.text_fr
    fill_in "Text it", with: @icd.text_it
    fill_in "Version", with: @icd.version
    click_on "Create Icd"

    assert_text "Icd was successfully created"
    click_on "Back"
  end

  test "updating a Icd" do
    visit icds_url
    click_on "Edit", match: :first

    fill_in "Code", with: @icd.code
    fill_in "Text de", with: @icd.text_de
    fill_in "Text fr", with: @icd.text_fr
    fill_in "Text it", with: @icd.text_it
    fill_in "Version", with: @icd.version
    click_on "Update Icd"

    assert_text "Icd was successfully updated"
    click_on "Back"
  end

  test "destroying a Icd" do
    visit icds_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Icd was successfully destroyed"
  end
end
