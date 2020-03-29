require 'test_helper'

class EarElementsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @ear_element = ear_elements(:one)
  end

  test "should get index" do
    get ear_elements_url
    assert_response :success
  end

  test "should get new" do
    get new_ear_element_url
    assert_response :success
  end

  test "should create ear_element" do
    assert_difference('EarElement.count') do
      post ear_elements_url, params: { ear_element: { img: @ear_element.img, name: @ear_element.name } }
    end

    assert_redirected_to ear_element_url(EarElement.last)
  end

  test "should show ear_element" do
    get ear_element_url(@ear_element)
    assert_response :success
  end

  test "should get edit" do
    get edit_ear_element_url(@ear_element)
    assert_response :success
  end

  test "should update ear_element" do
    patch ear_element_url(@ear_element), params: { ear_element: { img: @ear_element.img, name: @ear_element.name } }
    assert_redirected_to ear_element_url(@ear_element)
  end

  test "should destroy ear_element" do
    assert_difference('EarElement.count', -1) do
      delete ear_element_url(@ear_element)
    end

    assert_redirected_to ear_elements_url
  end
end
