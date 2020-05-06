require 'test_helper'

class IcdTest < ActiveSupport::TestCase
  test 'valid icd' do
    icd = Icd.new(id: 0, code: 'A00', version: 'ICD10-GM-2018', text_de: 'Test 1', text_fr: 'le Tèst', text_it: 'test 1', annotationen: '', kapitel: '')
    assert icd.valid?
  end

  test 'valid without id' do
    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_de: 'Test', text_fr: 'Test', text_it: 'test', annotationen: '', kapitel: '')
    assert icd.valid?
  end

  test 'valid without annotationen' do
    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_de: 'Test', text_fr: 'Test', text_it: 'test', kapitel: '')
    assert icd.valid?
  end

  test 'valid without kapitel' do
    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_de: 'test', text_fr: 'test', text_it: 'test', annotationen: '')
    assert icd.valid?
  end

  test 'invalid without code' do
    icd = Icd.new(version: 'ICD10-GM-2018', text_de: 'test', text_fr: 'test', text_it: 'test', annotationen: '', kapitel: '')
    refute icd.valid?, 'icd is valid without a code'
    assert_not_nil icd.errors[:code], 'no validation error for icd present'
  end

  test 'invalid without text' do
    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_fr: 'test', text_it: 'test', annotationen: '', kapitel: '')
    refute icd.valid?, 'icd is valid without a text_de'
    assert_not_nil icd.errors[:text_de], 'no validation error for icd present'

    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_de: 'test', text_it: 'test', annotationen: '', kapitel: '')
    refute icd.valid?, 'icd is valid without a text_fr'
    assert_not_nil icd.errors[:text_fr], 'no validation error for icd present'

    icd = Icd.new(code: 'A00', version: 'ICD10-GM-2018', text_de: 'test', text_fr: 'test', annotationen: '', kapitel: '')
    refute icd.valid?, 'icd is valid without a text_it'
    assert_not_nil icd.errors[:text_it], 'no validation error for icd present'
  end

  test 'invalid without version' do
    icd = Icd.new(code: 'A00', text_de: 'test', text_fr: 'test', text_it: 'test', annotationen: '', kapitel: '')
    refute icd.valid?, 'icd is valid without a version'
    assert_not_nil icd.errors[:version], 'no validation error for icd present'
  end
end
