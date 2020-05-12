require 'test_helper'

class Api::V1::SearchControllerTest < ActionDispatch::IntegrationTest

  test "should get index" do
    get search_url
    assert_response :success
  end

  test "should show search" do
    get search_url(@icd)
    assert_response :success
  end

  test "Should_return_three" do
    get "/search?q=D01"
    assert_includes(response.body, icds(:three).to_json)
    assert_not_includes(response.body, icds(:two).to_json)
  end
end