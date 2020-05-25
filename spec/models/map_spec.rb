# spec/models/map_spec.rb

require 'rails_helper'

RSpec.describe Map, :type => :model do

  subject {
    described_class.new(
        icd_id: 1,
        layer_id: 1
    )
  }

  before(:each) do
    @icd = FactoryBot.create(:icd)
    @layer = FactoryBot.create(:layer)
  end

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

end