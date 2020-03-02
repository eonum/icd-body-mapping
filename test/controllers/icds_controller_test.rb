require 'test_helper'

class IcdsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @icd = icds(:one)
  end

  test "should get index" do
    get icds_url
    assert_response :success
  end

  test "should get new" do
    get new_icd_url
    assert_response :success
  end

  test "should create icd" do
    assert_difference('Icd.count') do
      post icds_url, params: { icd: { code: @icd.code, text_de: @icd.text_de, text_fr: @icd.text_fr, text_it: @icd.text_it, version: @icd.version } }
    end

    assert_redirected_to icd_url(Icd.last)
  end

  test "should show icd" do
    get icd_url(@icd)
    assert_response :success
  end

  test "should get edit" do
    get edit_icd_url(@icd)
    assert_response :success
  end

  test "should update icd" do
    patch icd_url(@icd), params: { icd: { code: @icd.code, text_de: @icd.text_de, text_fr: @icd.text_fr, text_it: @icd.text_it, version: @icd.version } }
    assert_redirected_to icd_url(@icd)
  end

  test "should destroy icd" do
    assert_difference('Icd.count', -1) do
      delete icd_url(@icd)
    end

    assert_redirected_to icds_url
  end
end
