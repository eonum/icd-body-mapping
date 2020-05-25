# spec/models/icd_spec.rb

require 'rails_helper'

RSpec.describe Icd, :type => :model do

  subject {
    described_class.new(
        code: "A00",
        text_de: "Anything",
        text_fr: "Anything",
        text_it: "Anything",
        annotationen: "",
        kapitel: "1",
        code_kapitel: "A00-B00",
        kapitel_name_de: "Anything",
        kapitel_name_fr: "Anything",
        kapitel_name_it: "Anything",
        kapitel_roemisch: "I"
    )
  }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a code" do
    subject.code = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a text_de" do
    subject.text_de = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a text_fr" do
    subject.text_fr = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a text_it" do
    subject.text_it = nil
    expect(subject).to_not be_valid
  end

  it "is valid without a annotationen" do
    subject.annotationen = nil
    expect(subject).to be_valid
  end

  it "is valid without a kapitel" do
    subject.kapitel = nil
    expect(subject).to be_valid
  end

  it "is valid without a code_kapitel" do
    subject.code_kapitel = nil
    expect(subject).to be_valid
  end

  it "is valid without a kapitel_name_de" do
    subject.kapitel_name_de = nil
    expect(subject).to be_valid
  end

  it "is valid without a kapitel_name_fr" do
    subject.kapitel_name_fr = nil
    expect(subject).to be_valid
  end

  it "is valid without a kapitel_name_it" do
    subject.kapitel_name_it = nil
    expect(subject).to be_valid
  end

  it "is valid without a kapitel_roemisch" do
    subject.kapitel_roemisch = nil
    expect(subject).to be_valid
  end
end