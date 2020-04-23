class LayersController < ApplicationController
  before_action only: [:show, :edit, :update, :destroy, :showEbene]

  # GET /layers
  # GET /layers.json
  # layers = Layer.all.order(ebene: :asc)
  # render json: layers
  # @layers = Layer.all
  def index
    layers = Layer.select('distinct(ebene)').order(ebene: :asc)
    render json: layers
  end

  # GET /layers/1
  # GET /layers/1.json
  def show
    layers = Layer.all.where("ebene = ?", params[:id])
    render :json => layers
  end

  # GET /layers/new
  def new
    @layer = Layer.new
  end

  # GET /layers/1/edit
  def edit
  end

  # POST /layers
  # POST /layers.json
  def create
    @layer = Layer.new(layer_params)

    respond_to do |format|
      if @layer.save
        format.html { redirect_to @layer, notice: 'Layer was successfully created.' }
        format.json { render :show, status: :created, location: @layer }
      else
        format.html { render :new }
        format.json { render json: @layer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /layers/1
  # PATCH/PUT /layers/1.json
  def update
    respond_to do |format|
      if @layer.update(layer_params)
        format.html { redirect_to @layer, notice: 'Layer was successfully updated.' }
        format.json { render :show, status: :ok, location: @layer }
      else
        format.html { render :edit }
        format.json { render json: @layer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /layers/1
  # DELETE /layers/1.json
  def destroy
    @layer.destroy
    respond_to do |format|
      format.html { redirect_to layers_url, notice: 'Layer was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_layer
      @layer = Layer.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def layer_params
      params.require(:layer).permit(:ebene, :name, :img)
    end
end
