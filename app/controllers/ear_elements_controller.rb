class EarElementsController < ApplicationController
  before_action :set_ear_element, only: [:show, :edit, :update, :destroy]

  # GET /ear_elements
  # GET /ear_elements.json
  def index
    ear_elements = EarElement.all.order(name: :asc)
    render json: ear_elements
  end

  # GET /ear_elements/1
  # GET /ear_elements/1.json
  def show
  end

  # GET /ear_elements/new
  def new
    @ear_element = EarElement.new
  end

  # GET /ear_elements/1/edit
  def edit
  end

  # POST /ear_elements
  # POST /ear_elements.json
  def create
    @ear_element = EarElement.new(ear_element_params)

    respond_to do |format|
      if @ear_element.save
        format.html { redirect_to @ear_element, notice: 'Ear element was successfully created.' }
        format.json { render :show, status: :created, location: @ear_element }
      else
        format.html { render :new }
        format.json { render json: @ear_element.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ear_elements/1
  # PATCH/PUT /ear_elements/1.json
  def update
    respond_to do |format|
      if @ear_element.update(ear_element_params)
        format.html { redirect_to @ear_element, notice: 'Ear element was successfully updated.' }
        format.json { render :show, status: :ok, location: @ear_element }
      else
        format.html { render :edit }
        format.json { render json: @ear_element.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ear_elements/1
  # DELETE /ear_elements/1.json
  def destroy
    @ear_element.destroy
    respond_to do |format|
      format.html { redirect_to ear_elements_url, notice: 'Ear element was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ear_element
      @ear_element = EarElement.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ear_element_params
      params.require(:ear_element).permit(:name, :img)
    end
end
