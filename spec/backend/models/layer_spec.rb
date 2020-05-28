# spec/models/layer_spec.rb

require 'rails_helper'

RSpec.describe Layer, :type => :model do

  subject {
    described_class.new(
        id: 1,
        name: "Anything",
        ebene: "Anything",
        img: "./AnyUrl"
    )
  }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a name" do
    subject.name = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a ebene" do
    subject.ebene = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a img" do
    subject.img = nil
    expect(subject).to_not be_valid
  end

  it "is valid without an id" do
    subject.id = nil
    expect(subject).to be_valid
  end
end