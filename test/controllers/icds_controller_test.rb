require 'test_helper'

class IcdsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @icd = icds(:one)
  end

  test "should get index" do
    get icds_url
    assert_response :success
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

  test "routing_icds_tests" do
    assert_routing("/icds", :controller => "icds", :action => "index")
    assert_routing("/icds/1", :controller => "icds", :action => "show", id: "1")
  end

  test "Should_return_two" do
    get "/icds/2"
    assert_equal(response.body, icds(:two).to_json)
    assert_not_equal(response.body, icds(:one).to_json)
  end
end