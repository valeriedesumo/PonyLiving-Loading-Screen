/* Canvas Geometry Birds (by mrdoob)
    Animates a flying flock of birds, using the THREE animation library
*/

$(function() {
 var canvasBirds,
 // Create and append bird div
 bg = document.createElement('div');
 bg.id = "birds";
 document.body.appendChild(bg);
 // Initialise and main loop
 function start() {
  canvasBirds = new CanvasBirds(bg, window.innerWidth, window.innerHeight);
  setInterval(function(){canvasBirds.update();}, 1000/45); // 45 fps
 }


 /* Three.js (by mrdoob)
    A lightweight JavaScript library/API for animated 3D graphics

    Copyright 2010-2022 Three.js Authors
    SPDX-License-Identifier: MIT
 */
 var THREE=THREE||{};
 THREE.Color=function(a){
  this.styleString="rgba(0,0,0,1)",this.setHex=function(a){
   this.hex=a,this.updateRGBA(),this.updateStyleString();
  },this.setRGBA=function(a,b,c,d){
   this.r=a,this.g=b,this.b=c,this.a=d,this.updateHex(),this.updateStyleString();
  },this.updateHex=function(){
   this.hex=Math.floor(255*this.a)<<24|Math.floor(255*this.r)<<16|Math.floor(255*this.g)<<8|Math.floor(255*this.b);
  },this.updateRGBA=function(){
   this.a=(this.hex>>24 & 255)/255,this.r=(this.hex>>16 & 255)/255,this.g=(this.hex>>8 & 255)/255,this.b=(255 & this.hex)/255;
  },this.updateStyleString=function(){
   this.styleString="rgba("+Math.floor(255*this.r)+","+Math.floor(255*this.g)+","+Math.floor(255*this.b)+","+this.a+")";
  },this.toString=function(){
   return "THREE.Color(r:"+this.r+",g:"+this.g+",b:"+this.b+",a:"+this.a+",hex:"+this.hex+")";
  },this.setHex(a);
 },THREE.Vector2=function(a,b){
  this.x=a||0,this.y=b||0;
 },THREE.Vector2.prototype={
  set:function(a,b){this.x=a,this.y=b;},
  copy:function(a){this.x=a.x,this.y=a.y;},
  addSelf:function(a){this.x+=a.x,this.y+=a.y;},
  add:function(a,b){this.x=a.x+b.x,this.y=a.y+b.y;},
  subSelf:function(a){this.x-=a.x,this.y-=a.y;},
  sub:function(a,b){this.x=a.x-b.x,this.y=a.y-b.y;},
  multiplyScalar:function(a){this.x*=a,this.y*=a;},
  unit:function(){this.multiplyScalar(1/this.length());},
  length:function(){return Math.sqrt(this.x*this.x+this.y*this.y);},
  toString:function(){return "THREE.Vector2("+this.x+","+this.y+")";}
 },THREE.Vector3=function(a,b,c){
  this.x=a||0,this.y=b||0,this.z=c||0;
 },THREE.Vector3.prototype={
  set:function(a,b,c){this.x=a,this.y=b,this.z=c;},
  copy:function(a){this.x=a.x,this.y=a.y,this.z=a.z;},
  add:function(a,b){this.x=a.x+b.x,this.y=a.y+b.y,this.z=a.z+b.z;},
  addSelf:function(a){this.x+=a.x,this.y+=a.y,this.z+=a.z;},
  addScalar:function(a){this.x+=a,this.y+=a,this.z+=a;},
  sub:function(a,b){this.x=a.x-b.x,this.y=a.y-b.y,this.z=a.z-b.z;},
  subSelf:function(a){this.x-=a.x,this.y-=a.y,this.z-=a.z;},
  cross:function(a,b){this.x=a.y*b.z-a.z*b.y,this.y=a.z*b.x-a.x*b.z,this.z=a.x*b.y-a.y*b.x;},
  crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y,this.y=d*a.x-b*a.z,this.z=b*a.y-c*a.x;},
  multiplySelf:function(a){this.x*=a.x,this.y*=a.y,this.z*=a.z;},
  multiplyScalar:function(a){this.x*=a,this.y*=a,this.z*=a;},
  divideScalar:function(a){this.x/=a,this.y/=a,this.z/=a;},
  dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z;},
  distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a));},
  distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y,d=this.z-a.z;return b*b+c*c+d*d;},
  length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);},
  normalize:function(){this.multiplyScalar(this.length()>0?1/this.length():0);},
  isZero:function(){var a=1e-4;return Math.abs(this.x)<a&&Math.abs(this.y)<a&&Math.abs(this.z)<a; },
  toString:function(){return "THREE.Vector3("+this.x+","+this.y+","+this.z+")";}
 },THREE.Vector4=function(a,b,c,d){
  this.x=a||0,this.y=b||0,this.z=c||0,this.w=d||1;
 },THREE.Vector4.prototype={
  set:function(a,b,c,d){this.x=a,this.y=b,this.z=c,this.w=d;},
  copy:function(a){this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w;},
  add:function(a,b){this.x=a.x+b.x,this.y=a.y+b.y,this.z=a.z+b.z,this.w=a.w+b.w;},
  addSelf:function(a){this.x+=a.x,this.y+=a.y,this.z+=a.z,this.w+=a.w;},
  sub:function(a,b){ this.x=a.x-b.x,this.y=a.y-b.y,this.z=a.z-b.z,this.w=a.w-b.w;},
  subSelf:function(a){this.x-=a.x,this.y-=a.y,this.z-=a.z,this.w-=a.w;},
  toString:function(){return "THREE.Vector4("+this.x+","+this.y+","+this.z+","+this.w+")";}
 },THREE.Rectangle=function(){
  function a(){
   f=d-b,g=e-c;
  }
  var b,c,d,e,f,g,h=!0;
  this.getX=function(){
   return b;
  },this.getY=function(){
   return c;
  },this.getWidth=function(){
   return f;
  },this.getHeight=function(){
   return g;
  },this.getX1=function(){
   return b;
  },this.getY1=function(){
   return c;
  },this.getX2=function(){
   return d;
  },this.getY2=function(){
   return e;
  },this.set=function(f,g,i,j){
   h=!1,b=f,c=g,d=i,e=j,a();
  },this.addPoint=function(f,g){
   h?(h=!1,b=f,c=g,d=f,e=g):(b=Math.min(b,f),c=Math.min(c,g),d=Math.max(d,f),e=Math.max(e,g)),a();
  },this.addRectangle=function(f){
   h?(h=!1,b=f.getX1(),c=f.getY1(),d=f.getX2(),e=f.getY2()):(b=Math.min(b,f.getX1()),c=Math.min(c,f.getY1()),d=Math.max(d,f.getX2()),e=Math.max(e,f.getY2())),a();
  },this.inflate=function(f){
   b-=f,c-=f,d+=f,e+=f,a();
  },this.minSelf=function(f){
   b=Math.max(b,f.getX1()),c=Math.max(c,f.getY1()),d=Math.min(d,f.getX2()),e=Math.min(e,f.getY2()),a();
  },this.instersects=function(a){
   return Math.min(d,a.getX2())-Math.max(b,a.getX1())>= 0&&Math.min(e,a.getY2())-Math.max(c,a.getY1())>= 0;
  },this.empty=function(){
   h=!0,b=0,c=0,d=0,e=0,a();
  },this.isEmpty=function(){
   return h;
  },this.toString=function(){
   return "THREE.Rectangle(x1:"+b+",y1:"+e+",x2:"+d+",y1:"+c+",width:"+f+",height:"+g+")";
  };
 },THREE.Matrix4=function(){
  this._x=new THREE.Vector3(),this._y=new THREE.Vector3(),this._z=new THREE.Vector3();
 },THREE.Matrix4.prototype={
  n11:1,n12:0,n13:0,n14:0,n21:0,n22:1,n23:0,n24:0,n31:0,n32:0,n33:1,n34:0,n41:0,n42:0,n43:0,n44:1,
  identity:function(){
   this.n11=1,this.n12=0,this.n13=0,this.n14=0,this.n21=0,this.n22=1,this.n23=0,this.n24=0,this.n31=0,this.n32=0,this.n33=1,this.n34=0,this.n41=0,this.n42=0,this.n43=0,this.n44=1;
  },
  lookAt:function(a,b,c){
   var d=this._x,e=this._y,f=this._z;
   f.sub(a,b),f.normalize(),d.cross(c,f),d.normalize(),e.cross(f,d),e.normalize(),this.n11=d.x,this.n12=d.y,this.n13=d.z,this.n14=-d.dot(a),this.n21=e.x,this.n22=e.y,this.n23=e.z,this.n24=-e.dot(a),this.n31=f.x,this.n32=f.y,this.n33=f.z,this.n34=-f.dot(a);
  },
  transform:function(a){
   var b=a.x,c=a.y,d=a.z,e=a.w?a.w:1;
   a.x=this.n11*b+this.n12*c+this.n13*d+this.n14*e,a.y=this.n21*b+this.n22*c+this.n23*d+this.n24*e,a.z=this.n31*b+this.n32*c+this.n33*d+this.n34*e,e=this.n41*b+this.n42*c+this.n43*d+this.n44*e,a.w?a.w=e :(a.x=a.x/e,a.y=a.y/e,a.z=a.z/e);
  },
  crossVector:function(a){
   var b=new THREE.Vector4();
   return b.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w,b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w,b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w,b.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w :1,b;
  },
  multiply:function(a,b){
   this.n11=a.n11*b.n11+a.n12*b.n21+a.n13*b.n31+a.n14*b.n41,this.n12=a.n11*b.n12+a.n12*b.n22+a.n13*b.n32+a.n14*b.n42,this.n13=a.n11*b.n13+a.n12*b.n23+a.n13*b.n33+a.n14*b.n43,this.n14=a.n11*b.n14+a.n12*b.n24+a.n13*b.n34+a.n14*b.n44,this.n21=a.n21*b.n11+a.n22*b.n21+a.n23*b.n31+a.n24*b.n41,this.n22=a.n21*b.n12+a.n22*b.n22+a.n23*b.n32+a.n24*b.n42,this.n23=a.n21*b.n13+a.n22*b.n23+a.n23*b.n33+a.n24*b.n43,this.n24=a.n21*b.n14+a.n22*b.n24+a.n23*b.n34+a.n24*b.n44,
   this.n31=a.n31*b.n11+a.n32*b.n21+a.n33*b.n31+a.n34*b.n41,this.n32=a.n31*b.n12+a.n32*b.n22+a.n33*b.n32+a.n34*b.n42,this.n33=a.n31*b.n13+a.n32*b.n23+a.n33*b.n33+a.n34*b.n43,this.n34=a.n31*b.n14+a.n32*b.n24+a.n33*b.n34+a.n34*b.n44,this.n41=a.n41*b.n11+a.n42*b.n21+a.n43*b.n31+a.n44*b.n41,this.n42=a.n41*b.n12+a.n42*b.n22+a.n43*b.n32+a.n44*b.n42,this.n43=a.n41*b.n13+a.n42*b.n23+a.n43*b.n33+a.n44*b.n43,this.n44=a.n41*b.n14+a.n42*b.n24+a.n43*b.n34+a.n44*b.n44;
  },
  multiplySelf:function(a){
   var b=this.n11,c=this.n12,d=this.n13,e=this.n14,f=this.n21,g=this.n22,h=this.n23,i=this.n24,j=this.n31,k=this.n32,l=this.n33,m=this.n34,n=this.n41,o=this.n42,p=this.n43,q=this.n44;
   this.n11=b*a.n11+c*a.n21+d*a.n31+e*a.n41,this.n12=b*a.n12+c*a.n22+d*a.n32+e*a.n42,this.n13=b*a.n13+c*a.n23+d*a.n33+e*a.n43,this.n14=b*a.n14+c*a.n24+d*a.n34+e*a.n44,this.n21=f*a.n11+g*a.n21+h*a.n31+i*a.n41,this.n22=f*a.n12+g*a.n22+h*a.n32+i*a.n42,this.n23=f*a.n13+g*a.n23+h*a.n33+i*a.n43,this.n24=f*a.n14+g*a.n24+h*a.n34+i*a.n44,
   this.n31=j*a.n11+k*a.n21+l*a.n31+m*a.n41,this.n32=j*a.n12+k*a.n22+l*a.n32+m*a.n42,this.n33=j*a.n13+k*a.n23+l*a.n33+m*a.n43,this.n34=j*a.n14+k*a.n24+l*a.n34+m*a.n44,this.n41=n*a.n11+o*a.n21+p*a.n31+q*a.n41,this.n42=n*a.n12+o*a.n22+p*a.n32+q*a.n42,this.n43=n*a.n13+o*a.n23+p*a.n33+q*a.n43,this.n44=n*a.n14+o*a.n24+p*a.n34+q*a.n44;
  },
  multiplyScalar:function(a){
   this.n11*=a,this.n12*=a,this.n13*=a,this.n14*=a,this.n21*=a,this.n22*=a,this.n23*=a,this.n24*=a,this.n31*=a,this.n32*=a,this.n33*=a,this.n34*=a,this.n41*=a,this.n42*=a,this.n43*=a,this.n44*=a;
  },
  determinant:function(){
   return this.n14*this.n23*this.n32*this.n41-this.n13*this.n24*this.n32*this.n41-this.n14*this.n22*this.n33*this.n41+this.n12*this.n24*this.n33*this.n41+this.n13*this.n22*this.n34*this.n41-this.n12*this.n23*this.n34*this.n41-this.n14*this.n23*this.n31*this.n42+this.n13*this.n24*this.n31*this.n42+this.n14*this.n21*this.n33*this.n42-this.n11*this.n24*this.n33*this.n42-this.n13*this.n21*this.n34*this.n42+this.n11*this.n23*this.n34*this.n42+
          this.n14*this.n22*this.n31*this.n43-this.n12*this.n24*this.n31*this.n43-this.n14*this.n21*this.n32*this.n43+this.n11*this.n24*this.n32*this.n43+this.n12*this.n21*this.n34*this.n43-this.n11*this.n22*this.n34*this.n43-this.n13*this.n22*this.n31*this.n44+this.n12*this.n23*this.n31*this.n44+this.n13*this.n21*this.n32*this.n44-this.n11*this.n23*this.n32*this.n44-this.n12*this.n21*this.n33*this.n44+this.n11*this.n22*this.n33*this.n44;
  },
  toString:function(){
   return "| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |";
  }
 },THREE.Matrix4.translationMatrix=function(a,b,c){
  var d=new THREE.Matrix4();
  return d.n14=a,d.n24=b,d.n34=c,d;
 },THREE.Matrix4.scaleMatrix=function(a,b,c){
  var d=new THREE.Matrix4();
  return d.n11=a,d.n22=b,d.n33=c,d;
 },THREE.Matrix4.rotationXMatrix=function(a){
  var b=new THREE.Matrix4();
  return b.n22=b.n33=Math.cos(a),b.n32=Math.sin(a),b.n23=-b.n32,b;
 },THREE.Matrix4.rotationYMatrix=function(a){
  var b=new THREE.Matrix4();
  return b.n11=b.n33=Math.cos(a),b.n13=Math.sin(a),b.n31=-b.n13,b;
 },THREE.Matrix4.rotationZMatrix=function(a){
  var b=new THREE.Matrix4();
  return b.n11=b.n22=Math.cos(a),b.n21=Math.sin(a),b.n12=-b.n21,b;
 },THREE.Matrix4.makeInvert=function(a){
  var b=new THREE.Matrix4();
  return b.n11=a.n23*a.n34*a.n42-a.n24*a.n33*a.n42+a.n24*a.n32*a.n43-a.n22*a.n34*a.n43-a.n23*a.n32*a.n44+a.n22*a.n33*a.n44,b.n12=a.n14*a.n33*a.n42-a.n13*a.n34*a.n42-a.n14*a.n32*a.n43+a.n12*a.n34*a.n43+a.n13*a.n32*a.n44-a.n12*a.n33*a.n44,b.n13=a.n13*a.n24*a.n42-a.n14*a.n23*a.n42+a.n14*a.n22*a.n43-a.n12*a.n24*a.n43-a.n13*a.n22*a.n44+a.n12*a.n23*a.n44,b.n14=a.n14*a.n23*a.n32-a.n13*a.n24*a.n32-a.n14*a.n22*a.n33+a.n12*a.n24*a.n33+a.n13*a.n22*a.n34-a.n12*a.n23*a.n34,
         b.n21=a.n24*a.n33*a.n41-a.n23*a.n34*a.n41-a.n24*a.n31*a.n43+a.n21*a.n34*a.n43+a.n23*a.n31*a.n44-a.n21*a.n33*a.n44,b.n22=a.n13*a.n34*a.n41-a.n14*a.n33*a.n41+a.n14*a.n31*a.n43-a.n11*a.n34*a.n43-a.n13*a.n31*a.n44+a.n11*a.n33*a.n44,b.n23=a.n14*a.n23*a.n41-a.n13*a.n24*a.n41-a.n14*a.n21*a.n43+a.n11*a.n24*a.n43+a.n13*a.n21*a.n44-a.n11*a.n23*a.n44,b.n24=a.n13*a.n24*a.n31-a.n14*a.n23*a.n31+a.n14*a.n21*a.n33-a.n11*a.n24*a.n33-a.n13*a.n21*a.n34+a.n11*a.n23*a.n34,
         b.n31=a.n22*a.n34*a.n41-a.n24*a.n32*a.n41+a.n24*a.n31*a.n42-a.n21*a.n34*a.n42-a.n22*a.n31*a.n44+a.n21*a.n32*a.n44,b.n32=a.n14*a.n32*a.n41-a.n12*a.n34*a.n41-a.n14*a.n31*a.n42+a.n11*a.n34*a.n42+a.n12*a.n31*a.n44-a.n11*a.n32*a.n44,b.n33=a.n13*a.n24*a.n41-a.n14*a.n22*a.n41+a.n14*a.n21*a.n42-a.n11*a.n24*a.n42-a.n12*a.n21*a.n44+a.n11*a.n22*a.n44,b.n34=a.n14*a.n22*a.n31-a.n12*a.n24*a.n31-a.n14*a.n21*a.n32+a.n11*a.n24*a.n32+a.n12*a.n21*a.n34-a.n11*a.n22*a.n34,
         b.n41=a.n23*a.n32*a.n41-a.n22*a.n33*a.n41-a.n23*a.n31*a.n42+a.n21*a.n33*a.n42+a.n22*a.n31*a.n43-a.n21*a.n32*a.n43,b.n42=a.n12*a.n33*a.n41-a.n13*a.n32*a.n41+a.n13*a.n31*a.n42-a.n11*a.n33*a.n42-a.n12*a.n31*a.n43+a.n11*a.n32*a.n43,b.n43=a.n13*a.n22*a.n41-a.n12*a.n23*a.n41-a.n13*a.n21*a.n42+a.n11*a.n23*a.n42+a.n12*a.n21*a.n43-a.n11*a.n22*a.n43,b.n44=a.n12*a.n23*a.n31-a.n13*a.n22*a.n31+a.n13*a.n21*a.n32-a.n11*a.n23*a.n32-a.n12*a.n21*a.n33+a.n11*a.n22*a.n33,
         b.scale(1/a.determinant()),b;
 },THREE.Matrix4.makeFrustum=function(a,b,c,d,e,f){
  var g,h,i,j,k,l,m;
  return g=new THREE.Matrix4(),h=2*e/(b-a),i=2*e/(d-c),j=(b+a)/(b-a),k=(d+c)/(d-c),l=-(f+e)/(f-e),m=-2*f*e/(f-e),g.n11=h,g.n12=0,g.n13=j,g.n14=0,g.n21=0,g.n22=i,g.n23=k,g.n24=0,g.n31=0,g.n32=0,g.n33=l,g.n34=m,g.n41=0,g.n42=0,g.n43=-1,g.n44=0,g;
 },THREE.Matrix4.makePerspective=function(a,b,c,d){
  var e,f,g,h;
  return e=c*Math.tan(a*Math.PI/360),f=-e,g=f*b,h=e*b,THREE.Matrix4.makeFrustum(g,h,f,e,c,d);
 },THREE.Matrix4.makeOrtho=function(a,b,c,d,e,f){
  var g,h,i,j,k,l,m;
  return g=new THREE.Matrix4(),k=b-a,l=d-c,m=f-e,h=(b+a)/k,i=(d+c)/l,j=(f+e)/m,g.n11=2/k,g.n12=0,g.n13=0,g.n14=-h,g.n21=0,g.n22=2/l,g.n23=0,g.n24=-i,g.n31=0,g.n32=0,g.n33=-2/m,g.n34=-j,g.n41=0,g.n42=0,g.n43=0,g.n44=1,g;
 },THREE.Vertex=function(a,b){
  this.position=a||new THREE.Vector3(),this.normal=b||new THREE.Vector3(),this.screen=new THREE.Vector3(),this.visible=!0,
  this.toString=function(){
   return "THREE.Vertex(position:"+this.position+",normal:"+this.normal+")";
  };
 },THREE.Face3=function(a,b,c,d,e){
  this.a=a,this.b=b,this.c=c,this.normal=d||new THREE.Vector3(),this.screen=new THREE.Vector3(),this.color=e||new THREE.Color(0),
  this.toString=function(){
   return "THREE.Face3("+this.a+","+this.b+","+this.c+")";
  };
 },THREE.Face4=function(a,b,c,d,e,f){
  this.a=a,this.b=b,this.c=c,this.d=d,this.normal=e||new THREE.Vector3(),this.screen=new THREE.Vector3(),this.color=f||new THREE.Color(0),
  this.toString=function(){
   return "THREE.Face4("+this.a+","+this.b+","+this.c+" "+this.d+")";
  };
 },THREE.UV=function(a,b){
  this.u=a||0,this.v=b||0;
 },THREE.UV.prototype={
  copy:function(a){this.u=a.u,this.v=a.v;},
  toString:function(){return "THREE.UV("+this.u+","+this.v+")";}
 },THREE.Geometry=function(){
  this.vertices=[],this.faces=[],this.uvs=[],this.computeNormals=function(){
   var a,b,c,d,e,f,g,h;
   for(a=0;a<this.vertices.length;a++)this.vertices[a].normal.set(0,0,0);
   for(b=0;b<this.faces.length;b++)c=this.vertices[this.faces[b].a],d=this.vertices[this.faces[b].b],e=this.vertices[this.faces[b].c],f=new THREE.Vector3(),g=new THREE.Vector3(),h=new THREE.Vector3(),f.sub(e.position,d.position),g.sub(c.position,d.position),f.crossSelf(g),f.isZero()||f.normalize(),this.faces[b].normal=f,c.normal.addSelf(h),d.normal.addSelf(h),e.normal.addSelf(h),this.faces[b] instanceof THREE.Face4&&this.vertices[this.faces[b].d].normal.addSelf(h);
  };
 },THREE.Camera=function(a,b,c,d){
  this.position=new THREE.Vector3(0,0,0),this.target={
   position:new THREE.Vector3(0,0,0)
  },this.projectionMatrix=THREE.Matrix4.makePerspective(a,b,c,d),this.up=new THREE.Vector3(0,1,0),this.matrix=new THREE.Matrix4(),this.autoUpdateMatrix=!0,this.updateMatrix=function(){
   this.matrix.lookAt(this.position,this.target.position,this.up);
  },this.toString=function(){
   return "THREE.Camera("+this.position+","+this.target.position+")";
  };
 },THREE.Object3D=function(a){
  this.position=new THREE.Vector3(),this.rotation=new THREE.Vector3(),this.scale=new THREE.Vector3(1,1,1),this.matrix=new THREE.Matrix4(),this.screen=new THREE.Vector3(),this.material=a instanceof Array?a :[a],this.autoUpdateMatrix=!0,this.updateMatrix=function(){
   this.matrix.identity(),this.matrix.multiplySelf(THREE.Matrix4.translationMatrix(this.position.x,this.position.y,this.position.z)),this.matrix.multiplySelf(THREE.Matrix4.rotationXMatrix(this.rotation.x)),this.matrix.multiplySelf(THREE.Matrix4.rotationYMatrix(this.rotation.y)),this.matrix.multiplySelf(THREE.Matrix4.rotationZMatrix(this.rotation.z)),this.matrix.multiplySelf(THREE.Matrix4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z));
  };
 },THREE.Line=function(a,b){
  THREE.Object3D.call(this,b),this.geometry=a;
 },THREE.Line.prototype=new THREE.Object3D(),THREE.Line.prototype.constructor=THREE.Line,THREE.Mesh=function(a,b){
  THREE.Object3D.call(this,b),this.geometry=a,this.flipSided=!1,this.doubleSided=!1,this.overdraw=!1;
 },THREE.Mesh.prototype=new THREE.Object3D(),THREE.Mesh.prototype.constructor=THREE.Mesh,THREE.Particle=function(a){
  THREE.Object3D.call(this,a),this.autoUpdateMatrix=!1;
 },THREE.Particle.prototype=new THREE.Object3D(),THREE.Particle.prototype.constructor=THREE.Particle,THREE.LineColorMaterial=function(a,b,c){
  this.lineWidth=c||1,this.color=new THREE.Color((b >= 0?255*b<<24 :4278190080)|a),
  this.toString=function(){
   return "THREE.LineColorMaterial(color:"+this.color+",lineWidth:"+this.lineWidth+")";
  };
 },THREE.MeshBitmapUVMappingMaterial=function(a){
  this.bitmap=a,
  this.toString=function(){
   return "THREE.MeshBitmapUVMappingMaterial(bitmap:"+this.bitmap+")";
  };
 },THREE.MeshColorFillMaterial=function(a,b){
  this.color=new THREE.Color((b >= 0?255*b<<24 :4278190080)|a),
  this.toString=function(){
   return "THREE.MeshColorFillMaterial(color:"+this.color+")";
  };
 },THREE.MeshColorStrokeMaterial=function(a,b,c){
  this.lineWidth=c||1,this.color=new THREE.Color((b >= 0?255*b<<24 :4278190080)|a),
  this.toString=function(){
   return "THREE.MeshColorStrokeMaterial(lineWidth:"+this.lineWidth+",color:"+this.color+")";
  };
 },THREE.MeshFaceColorFillMaterial=function(){
  this.toString=function(){
   return "THREE.MeshFaceColorFillMaterial()";
  };
 },THREE.MeshFaceColorStrokeMaterial=function(a){
  this.lineWidth=a||1,
  this.toString=function(){
   return "THREE.MeshFaceColorStrokeMaterial(lineWidth:"+this.lineWidth+")";
  };
 },THREE.ParticleBitmapMaterial=function(a){
  this.bitmap=a,this.offset=new THREE.Vector2(),
  this.toString=function(){
   return "THREE.ParticleBitmapMaterial(bitmap:"+this.bitmap+")";
  };
 },THREE.ParticleCircleMaterial=function(a,b){
  this.color=new THREE.Color((b >= 0?255*b<<24 :4278190080)|a),
  this.toString=function(){
   return "THREE.ParticleCircleMaterial(color:"+this.color+")";
  };
 },THREE.Scene=function(){
  this.objects=[],this.addObject=function(a){
   this.objects.push(a);
  },this.removeObject=function(a){
   for(var b=0,c=this.objects.length;c>b;b++)if(a === this.objects[b])return void this.objects.splice(b,1);
  },this.add=function(a){
   this.addObject(a);
  },this.toString=function(){
   return "THREE.Scene("+this.objects+")";
  };
 },THREE.Renderer=function(){
  function a(a,b){
   return b.z-a.z;
  }
  var b=[],c=[],d=[],e=[],f=new THREE.Vector4(),g=new THREE.Matrix4();
  this.renderList=null,this.project=function(h,i){
   var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x=0,y=0,z=0,A=0;
   for(this.renderList=[],i.autoUpdateMatrix&&i.updateMatrix(),j=0,k=h.objects.length;k>j;j++)
    if(s=h.objects[j],s.autoUpdateMatrix&&s.updateMatrix(),s instanceof THREE.Mesh){
     for(g.multiply(i.matrix,s.matrix),l=0,m=s.geometry.vertices.length;m>l;l++)p=s.geometry.vertices[l],p.screen.copy(p.position),g.transform(p.screen),i.projectionMatrix.transform(p.screen),p.visible=p.screen.z>0&&p.screen.z<1;
     for(n=0,o=s.geometry.faces.length;o>n;n++)r=s.geometry.faces[n],
     r instanceof THREE.Face3?(t=s.geometry.vertices[r.a],u=s.geometry.vertices[r.b],v=s.geometry.vertices[r.c],
      t.visible&&u.visible&&v.visible&&(s.doubleSided||s.flipSided !==(v.screen.x-t.screen.x)*(u.screen.y-t.screen.y)-(v.screen.y-t.screen.y)*(u.screen.x-t.screen.x)<0)&&(b[x]||(b[x]=new THREE.RenderableFace3()),b[x].v1.copy(t.screen),b[x].v2.copy(u.screen),b[x].v3.copy(v.screen),b[x].z=Math.max(t.screen.z,Math.max(u.screen.z,v.screen.z)),b[x].material=s.material,b[x].overdraw=s.overdraw,b[x].uvs=s.geometry.uvs[n],b[x].color=r.color,this.renderList.push(b[x]),x++)):
      r instanceof THREE.Face4&&(t=s.geometry.vertices[r.a],u=s.geometry.vertices[r.b],v=s.geometry.vertices[r.c],w=s.geometry.vertices[r.d],t.visible&&u.visible&&v.visible&&w.visible&&(s.doubleSided||s.flipSided !==((w.screen.x-t.screen.x)*(u.screen.y-t.screen.y)-(w.screen.y-t.screen.y)*(u.screen.x-t.screen.x)<0||(u.screen.x-v.screen.x)*(w.screen.y-v.screen.y)-(u.screen.y-v.screen.y)*(w.screen.x-v.screen.x)<0))&&
      (c[y]||(c[y]=new THREE.RenderableFace4()),c[y].v1.copy(t.screen),c[y].v2.copy(u.screen),c[y].v3.copy(v.screen),c[y].v4.copy(w.screen),c[y].z=Math.max(t.screen.z,Math.max(u.screen.z,Math.max(v.screen.z,w.screen.z))),c[y].material=s.material,c[y].overdraw=s.overdraw,c[y].uvs=s.geometry.uvs[n],c[y].color=r.color,this.renderList.push(c[y]),y++));
    } else if(s instanceof THREE.Line)
    for(g.multiply(i.matrix,s.matrix),l=0,m=s.geometry.vertices.length;m>l;l++)p=s.geometry.vertices[l],p.screen.copy(p.position),g.transform(p.screen),i.projectionMatrix.transform(p.screen),p.visible=p.screen.z>0&&p.screen.z<1,l>0&&(q=s.geometry.vertices[l-1],p.visible&&q.visible&&(d[z]||(d[z]=new THREE.RenderableLine()),d[z].v1.copy(p.screen),d[z].v2.copy(q.screen),d[z].z=Math.max(p.screen.z,q.screen.z),d[z].material=s.material,this.renderList.push(d[z]),z++));
   else s instanceof THREE.Particle&&
      (f.set(s.position.x,s.position.y,s.position.z,1),i.matrix.transform(f),i.projectionMatrix.transform(f),s.screen.set(f.x/f.w,f.y/f.w,f.z/f.w),
        s.screen.z>0&&s.screen.z<1&&(e[A]||(e[A]=new THREE.RenderableParticle()),e[A].x=s.screen.x,e[A].y=s.screen.y,e[A].z=s.screen.z,e[A].rotation=s.rotation.z,e[A].scale.x=s.scale.x*Math.abs(f.x/f.w-(f.x+i.projectionMatrix.n11)/(f.w+i.projectionMatrix.n14)),e[A].scale.y=s.scale.y*Math.abs(f.y/f.w-(f.y+i.projectionMatrix.n22)/(f.w+i.projectionMatrix.n24)),e[A].material=s.material,e[A].color=s.color,this.renderList.push(e[A]),A++));
   this.renderList.sort(a);
  };
 },THREE.CanvasRenderer=function(){
  function a(a,b,c,d,e,f,g,i,j,k,l,m,n){
   var o,p,q,r,s,t,u;
   h.beginPath(),h.moveTo(b,c),h.lineTo(d,e),h.lineTo(f,g),h.lineTo(b,c),h.closePath(),h.save(),h.clip(),o=i*(n-l)-k*n+m*l+(k-m)*j,p=-(j*(f-d)-l*f+n*d+(l-n)*b)/o,q=(l*g+j*(e-g)-n*e+(n-l)*c)/o,r=(i*(f-d)-k*f+m*d+(k-m)*b)/o,s=-(k*g+i*(e-g)-m*e+(m-k)*c)/o,t=(i*(n*d-l*f)+j*(k*f-m*d)+(m*l-k*n)*b)/o,u=(i*(n*e-l*g)+j*(k*g-m*e)+(m*l-k*n)*c)/o,h.transform(p,q,r,s,t,u),h.drawImage(a,0,0),h.restore();
  }
  function b(a,b){
   l.sub(b,a),l.unit(),b.addSelf(l),a.subSelf(l);
  }
  THREE.Renderer.call(this);
  var c,d,e,f,g=document.createElement("canvas"),h=g.getContext("2d"),i=new THREE.Rectangle(),j=new THREE.Rectangle(),k=new THREE.Rectangle(),l=new THREE.Vector2(),m=new THREE.Vector2(),n=new THREE.Vector2(),o=new THREE.UV(),p=new THREE.UV(),q=new THREE.UV(),r=new THREE.UV();
  this.domElement=g,this.autoClear=!0,this.setSize=function(a,b){
   c=a,d=b,e=c/2,f=d/2,g.width=c,g.height=d,i.set(-e,-f,e,f);
  },this.clear=function(){
   j.isEmpty()||(j.inflate(1),j.minSelf(i),h.setTransform(1,0,0,1,e,f),h.clearRect(j.getX(),-(j.getHeight()+j.getY()),j.getWidth(),j.getHeight()),j.empty());
  },this.render=function(c,d){
   var g,l,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R=2*Math.PI;
   for(this.project(c,d),this.autoClear&&this.clear(),h.setTransform(1,0,0,-1,e,f),g=0,l=this.renderList.length;l>g;g++){
    if(u=this.renderList[g],k.empty(),u instanceof THREE.RenderableParticle){
     for(w=u.x*e,x=u.y*f,s=0,t=u.material.length;t>s;s++)
      if(v=u.material[s],v instanceof THREE.ParticleCircleMaterial){
       if(I=u.scale.x*e,J=u.scale.y*f,k.set(w-I,x-J,w+I,x+J),!i.instersects(k))continue;
       h.save(),h.translate(w,x),h.rotate(-u.rotation),h.scale(I,J),h.beginPath(),h.arc(0,0,1,0,R,!0),h.closePath(),h.fillStyle=v.color.styleString,h.fill(),h.restore();
      } else if(v instanceof THREE.ParticleBitmapMaterial){
      if(O=v.bitmap,P=O.width/2,Q=O.height/2,K=u.scale.x*e,L=u.scale.y*f,I=K*P,J=L*Q,M=v.offset.x*K,N=v.offset.y*L,k.set(w+M-I,x+N-J,w+M+I,x+N+J),!i.instersects(k))continue;
      h.save(),h.translate(w,x),h.rotate(-u.rotation),h.scale(K,-L),h.translate(-P+v.offset.x,-Q-v.offset.y),h.drawImage(O,0,0),h.restore();
     }
    } else if(u instanceof THREE.RenderableLine){
     if(w=u.v1.x*e,x=u.v1.y*f,y=u.v2.x*e,z=u.v2.y*f,k.addPoint(w,x),k.addPoint(y,z),!i.instersects(k))continue;
     for(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.closePath(),s=0,t=u.material.length;t>s;s++)v=u.material[s],v instanceof THREE.LineColorMaterial&&(h.lineWidth=v.lineWidth,h.lineJoin="round",h.lineCap="round",h.strokeStyle=v.color.styleString,h.stroke(),k.inflate(h.lineWidth));
    } else if(u instanceof THREE.RenderableFace3){
     if(u.v1.x*=e,u.v1.y*=f,u.v2.x*=e,u.v2.y*=f,u.v3.x*=e,u.v3.y*=f,u.overdraw&&(b(u.v1,u.v2),b(u.v2,u.v3),b(u.v3,u.v1)),w=u.v1.x,x=u.v1.y,y=u.v2.x,z=u.v2.y,A=u.v3.x,B=u.v3.y,k.addPoint(w,x),k.addPoint(y,z),k.addPoint(A,B),!i.instersects(k))continue;
     for(s=0,t=u.material.length;t>s;s++)v=u.material[s],
     v instanceof THREE.MeshColorFillMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(w,x),h.closePath(),h.fillStyle=v.color.styleString,h.fill()):
      v instanceof THREE.MeshColorStrokeMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(w,x),h.closePath(),h.lineWidth=v.lineWidth,h.lineJoin="round",h.lineCap="round",h.strokeStyle=v.color.styleString,h.stroke(),k.inflate(h.lineWidth)):
       v instanceof THREE.MeshFaceColorFillMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(w,x),h.closePath(),h.fillStyle=u.color.styleString,h.fill()):
        v instanceof THREE.MeshFaceColorStrokeMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(w,x),h.closePath(),h.lineWidth=v.lineWidth,h.lineJoin="round",h.lineCap="round",h.strokeStyle=u.color.styleString,h.stroke(),k.inflate(h.lineWidth)):
         v instanceof THREE.MeshBitmapUVMappingMaterial&&(O=v.bitmap,P=O.width-1,Q=O.height-1,o.copy(u.uvs[0]),p.copy(u.uvs[1]),q.copy(u.uvs[2]),o.u*=P,o.v*=Q,p.u*=P,p.v*=Q,q.u*=P,q.v*=Q,a(O,w,x,y,z,A,B,o.u,o.v,p.u,p.v,q.u,q.v));
    } else if(u instanceof THREE.RenderableFace4){
     if(u.v1.x*=e,u.v1.y*=f,u.v2.x*=e,u.v2.y*=f,u.v3.x*=e,u.v3.y*=f,u.v4.x*=e,u.v4.y*=f,m.copy(u.v2),n.copy(u.v4),u.overdraw&&(b(u.v1,u.v2),b(u.v2,u.v4),b(u.v4,u.v1)),w=u.v1.x,x=u.v1.y,y=u.v2.x,z=u.v2.y,C=u.v4.x,D=u.v4.y,u.overdraw&&(b(u.v3,m),b(u.v3,n)),A=u.v3.x,B=u.v3.y,E=m.x,F=m.y,G=n.x,H=n.y,k.addPoint(w,x),k.addPoint(y,z),k.addPoint(A,B),k.addPoint(C,D),!i.instersects(k))continue;
     for(s=0,t=u.material.length;t>s;s++)v=u.material[s],
     v instanceof THREE.MeshColorFillMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(C,D),h.lineTo(w,x),h.closePath(),h.fillStyle=v.color.styleString,h.fill()):
      v instanceof THREE.MeshColorStrokeMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(C,D),h.lineTo(w,x),h.closePath(),h.lineWidth=v.lineWidth,h.lineJoin="round",h.lineCap="round",h.strokeStyle=v.color.styleString,h.stroke(),k.inflate(h.lineWidth)):
       v instanceof THREE.MeshFaceColorFillMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(C,D),h.lineTo(w,x),h.closePath(),h.fillStyle=u.color.styleString,h.fill()):
        v instanceof THREE.MeshFaceColorStrokeMaterial?(h.beginPath(),h.moveTo(w,x),h.lineTo(y,z),h.lineTo(A,B),h.lineTo(C,D),h.lineTo(w,x),h.closePath(),h.lineWidth=v.lineWidth,h.lineJoin="round",h.lineCap="round",h.strokeStyle=u.color.styleString,h.stroke(),k.inflate(h.lineWidth)):
         v instanceof THREE.MeshBitmapUVMappingMaterial&&(O=v.bitmap,P=O.width-1,Q=O.height-1,o.copy(u.uvs[0]),p.copy(u.uvs[1]),q.copy(u.uvs[2]),r.copy(u.uvs[3]),o.u*=P,o.v*=Q,p.u*=P,p.v*=Q,q.u*=P,q.v*=Q,r.u*=P,r.v*=Q,a(O,w,x,y,z,C,D,o.u,o.v,p.u,p.v,r.u,r.v),a(O,E,F,A,B,G,H,p.u,p.v,q.u,q.v,r.u,r.v));
    }
    j.addRectangle(k);
   }
   h.setTransform(1,0,0,1,0,0);
  };
 },THREE.CanvasRenderer.prototype=new THREE.Renderer(),THREE.CanvasRenderer.prototype.constructor=THREE.CanvasRenderer,THREE.RenderableFace3=function(){
  this.v1=new THREE.Vector2(),this.v2=new THREE.Vector2(),this.v3=new THREE.Vector2(),this.z=null,this.color=null,this.material=null;
 },THREE.RenderableFace4=function(){
  this.v1=new THREE.Vector2(),this.v2=new THREE.Vector2(),this.v3=new THREE.Vector2(),this.v4=new THREE.Vector2(),this.z=null,this.color=null,this.material=null;
 },THREE.RenderableParticle=function(){
  this.x=null,this.y=null,this.z=null,this.rotation=null,this.scale=new THREE.Vector2(),this.color=null,this.material=null;
 },THREE.RenderableLine=function(){
  this.v1=new THREE.Vector2(),this.v2=new THREE.Vector2(),this.z=null,this.color=null,this.material=null;
 };


 // Bird functions, utilising THREE library
 function CanvasBirds(a,b,c){
  function d(){
   l=new THREE.Vector3(0,1e3,0),g=new THREE.Camera(75,p/q,1,1e4),g.position.z=500,h=new THREE.Scene(),j=[],n=[],i=new THREE.CanvasRenderer(),i.domElement.style.position="absolute",i.domElement.style.left="0px",i.domElement.style.top="0px",i.setSize(p,q),a.style.left="0px",a.appendChild(i.domElement),o=setInterval(e,100);
  }
  function e(){
   m=n[n.length]=new Boid(),m.position.x=100*Math.random()+900,m.position.y=600*Math.random()-300,m.position.z=200*Math.random()-100,m.velocity.x=2*Math.random()+1,m.velocity.y=2*Math.random()+1,m.velocity.z=2*Math.random()+1,m.setAvoidWalls(!0),m.setWorldSize(1e3,800,300),k=j[j.length]=new THREE.Mesh(new Crow(),new THREE.MeshColorFillMaterial(0)),k.phase=Math.floor(62.83*Math.random()),k.position=m.position,k.doubleSided=!0,h.addObject(k),n.length>t&&clearInterval(o);
  }
  var g,h,i,j,k,l,m,n,o,p=b,q=c,t=100;
  this.container=a,d(),this.update=function(){
   for (var a,b=0,c=j.length;c>b;b++) m=n[b],m.run(n),l.z=m.position.z,m.repulse(l),k=j[b],a=k.material[0].color,a.r=a.g=a.b=(500-k.position.z)/1e3,a.updateStyleString(),k.rotation.y=Math.atan2(-m.velocity.z,m.velocity.x),k.rotation.z=Math.asin(m.velocity.y/m.velocity.length()),k.phase += Math.max(0,k.rotation.z-0.5)+0.1,k.geometry.vertices[5].position.y=k.geometry.vertices[4].position.y=5*Math.sin(k.phase % 62.83);
   i.render(h,g);
  };
 }
 var Boid=function(){
  var a,b,c,d,e,f=new THREE.Vector3(),g=100,h=3,i=0.1,j=!1;
  this.position=new THREE.Vector3(),this.velocity=new THREE.Vector3(),a=new THREE.Vector3(),this.setGoal=function(a){
   e=a;
  },this.setAvoidWalls=function(a){
   j=a;
  },this.setWorldSize=function(a,e,f){
   b=a,c=e,d=f;
  },this.run=function(e){
   j&&(f.set(-b,this.position.y,this.position.z),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f),f.set(b,this.position.y,this.position.z),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f),f.set(this.position.x,-c,this.position.z),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f),f.set(this.position.x,c,this.position.z),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f),
   f.set(this.position.x,this.position.y,-d),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f),f.set(this.position.x,this.position.y,d),f=this.avoid(f),f.multiplyScalar(5),a.addSelf(f)),Math.random()>0.5&&this.flock(e),this.move();
  },this.flock=function(b){
   e&&a.addSelf(this.reach(e,0.005)),a.addSelf(this.alignment(b)),a.addSelf(this.cohesion(b)),a.addSelf(this.separation(b));
  },this.move=function(){
   this.velocity.addSelf(a);
   var b=this.velocity.length();
   b>h&&this.velocity.divideScalar(b/h),this.position.addSelf(this.velocity),a.set(0,0,0);
  },this.checkBounds=function(){
   this.position.x>b&&(this.position.x=-b),this.position.x<-b&&(this.position.x=b),this.position.y>c&&(this.position.y=-c),this.position.y<-c&&(this.position.y=c),this.position.z>d&&(this.position.z=-d),this.position.z<-d&&(this.position.z=d);
  },this.avoid=function(a){
   var b=new THREE.Vector3();
   return b.copy(this.position),b.subSelf(a),b.multiplyScalar(1/this.position.distanceToSquared(a)),b;
  },this.repulse=function(b){
   var c=this.position.distanceTo(b);
   if (150>c){
    var d=new THREE.Vector3();
    d.copy(this.position),d.subSelf(b),d.multiplyScalar(0.5/this.position.distanceTo(b)),a.addSelf(d);
   }
  },this.reach=function(a,b){
   var c=new THREE.Vector3();
   return c.copy(a),c.subSelf(this.position),c.multiplyScalar(b),c;
  },this.alignment=function(a){
   for (var b,c=new THREE.Vector3(),d=0,e=0,f=a.length,distance;f>e;e++) Math.random()>0.6||(b=a[e],distance=b.position.distanceTo(this.position),distance>0&&g >= distance&&(c.addSelf(b.velocity),d++));
   if (d>0){
    c.divideScalar(d);
    var h=c.length();
    h>i&&c.divideScalar(h/i);
   }
   return c;
  },this.cohesion=function(a){
   for (var b,c,d=new THREE.Vector3(),e=new THREE.Vector3(),f=0,h=0,j=a.length;j>h;h++) Math.random()>0.6||(b=a[h],c=b.position.distanceTo(this.position),c>0&&g >= c&&(d.addSelf(b.position),f++));
   f>0&&d.divideScalar(f),e.copy(d),e.subSelf(this.position);
   var k=e.length();
   return k>i&&e.divideScalar(k/i),e;
  },this.separation=function(a){
   for (var b,c,d=new THREE.Vector3(),e=new THREE.Vector3(),f=0,h=a.length;h>f;f++) Math.random()>0.6||(b=a[f],c=b.position.distanceTo(this.position),c>0&&g >= c&&(e.copy(this.position),e.subSelf(b.position),e.normalize(),e.divideScalar(c),d.addSelf(e)));
   return d;
  };
 },
 Crow=function(){
  function a(a,b,d){
   c.vertices.push(new THREE.Vertex(new THREE.Vector3(a,b,d)));
  }
  function b(a,b,d){
   c.faces.push(new THREE.Face3(a,b,d));
  }
  var c=this;
  THREE.Geometry.call(this),a(5,0,0),a(-5,-2,1),a(-5,0,0),a(-5,-2,-1),a(0,2,-6),a(0,2,6),a(2,0,0),a(-3,0,0),b(0,2,1),b(4,7,6),b(5,6,7);
 };
 Crow.prototype=new THREE.Geometry(),Crow.prototype.constructor=Crow;
 start();
});