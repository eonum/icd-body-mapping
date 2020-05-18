require 'test_helper'

class LayerTest < ActiveSupport::TestCase
  test 'valid layer' do
    layer = Layer.new(id: 1, name: 'bild', ebene: 'ebene', img:'img')
    assert layer.valid?
  end

  test 'valid without id' do
    layer = Layer.new(name: 'bild', ebene: 'ebene', img:'img')
    assert layer.valid?
  end

  test 'invalid without name' do
    layer = Layer.new(name: '', ebene: 'ebene', img:'img')
    refute layer.valid?, 'layer is valid without a name'
    assert_not_nil layer.errors[:name], 'no validation error for layer present'
  end

  test 'invalid without ebene' do
    layer = Layer.new(name: 'name', ebene: '', img:'img')
    refute layer.valid?, 'layer is valid without a ebene'
    assert_not_nil layer.errors[:ebene], 'no validation error for layer present'
  end

  test 'invalid without img' do
    layer = Layer.new(name: 'name', ebene: 'ebene', img:'')
    refute layer.valid?, 'layer is valid without a img'
    assert_not_nil layer.errors[:img], 'no validation error for layer present'
  end
end
