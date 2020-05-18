require 'test_helper'

class MapTest < ActiveSupport::TestCase
  # before executes before each test
  setup do
    @map = Map.new
  end

  test "should validate presence of icd_id" do
    @map.valid? # triggers the validations
    assert_includes(
        @map.errors.details[:icd_id],
        { error: :blank }
    )
  end

  test "should validate presence of layer_id" do
    @map.valid? # triggers the validations
    assert_includes(
        @map.errors.details[:layer_id],
        { error: :blank }
    )
  end
end
