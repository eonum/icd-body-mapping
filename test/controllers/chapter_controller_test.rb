require 'test_helper'

class ChapterControllerTest < ActionDispatch::IntegrationTest

  test "should get index" do
    get api_v1_chapter_url
    assert_response :success
  end

  test "should show icd" do
    get api_v1_chapter_url
    assert_response :success
  end

  test "routing_chapter_tests" do
    assert_routing("api/v1/chapter", :controller => "api/v1/chapter", :action => "index")
    assert_routing("api/v1/chapter/1", :controller => "api/v1/chapter", :action => "show", :kapitel => "1")
  end

end