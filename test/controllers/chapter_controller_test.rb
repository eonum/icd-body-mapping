require 'test_helper'

class ChapterControllerTest < ActionDispatch::IntegrationTest

  test "should get index" do
    get chapter_url
    assert_response :success
  end

  test "should show icd" do
    get chapter_path
    assert_response :success
  end

  test "routing_chapter_tests" do
    assert_routing("/chapter", :controller => "chapter", :action => "index")
    assert_routing("/chapter/1", :controller => "chapter", :action => "show", :kapitel => "1")
  end

end