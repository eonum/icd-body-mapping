class ChapterController < ApplicationController


  before_action only: :show

  def index; end

  def show
    @icds = Icd.find_by_kapitel(:kapitel)
  end

  private

end