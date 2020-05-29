# spec/models/map_spec.rb

require 'rails_helper'

RSpec.describe Map, :type => :model do

  before(:all) do
    @icd = FactoryBot.create(:icd)
    @layer = FactoryBot.create(:layer)
  end

  subject {
    described_class.new(
        icd_id: @icd.id,
        layer_id: @layer.id
    )
  }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a icd_id" do
    subject.icd_id = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a layer_id" do
    subject.layer_id = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without an existing icd" do
    subject.icd_id = 2
    expect(subject).to_not be_valid
  end

  it "is not valid without an existing layer" do
    subject.layer_id = 2
    expect(subject).to_not be_valid
  end

end