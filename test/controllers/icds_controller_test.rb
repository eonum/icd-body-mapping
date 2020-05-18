require 'test_helper'

class IcdsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @icd = icds(:one)
    @icd2 = icds(:two)
  end

  test "should get index" do
    get api_v1_icds_url
    assert_response :success
  end

  test "should show icd" do
    get api_v1_icd_url(@icd)
    assert_response :success
  end

  test "should update icd" do
    patch api_v1_icd_url(@icd), params: { icd: { code: @icd.code, text_de: @icd.text_de, text_fr: @icd.text_fr, text_it: @icd.text_it, version: @icd.version } }
    assert_response :success
  end

  test "routing_icds_tests" do
    assert_routing("/api/v1/icds", :controller => "api/v1/icds", :action => "index")
    assert_routing("/api/v1/icds/1", :controller => "api/v1/icds", :action => "show", id: "1")
  end

  test "Should_return_two" do
    get "/api/v1/icds/2"
    assert_equal(response.body, icds(:two).to_json)
    assert_not_equal(response.body, icds(:one).to_json)
  end
end